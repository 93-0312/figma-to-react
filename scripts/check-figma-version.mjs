#!/usr/bin/env node
/**
 * Phase 1 — Figma **발행(publish) 감지** (플랜 무관: 모든 플랜에서 PAT 로 동작)
 *
 * ★ 릴리즈 신호는 "저장"이 아니라 "발행"이다.
 *   Figma `GET /v1/files/:key/versions` 는 각 버전의 `label` 을 준다. 라이브러리를
 *   publish 하면 Figma 가 "Components published" 라벨을 자동으로 붙이고, 사람이 직접
 *   이름을 붙일 수도 있다. 무명 autosave 는 **작업 중** 상태이므로 릴리즈가 아니다.
 *   → 이 스크립트는 **이름 붙은 최신 버전**을 기준으로 변경을 판정한다.
 *   그 덕에 디자이너는 자유롭게 저장하며 실험하고, publish 를 누른 순간에만 코드에
 *   반영된다(예고 없는 시각 변경 방지 + autosave 노이즈 원천 차단).
 *
 * 사용:
 *   FIGMA_TOKEN=figd_xxx node scripts/check-figma-version.mjs          # 발행 감지
 *   FIGMA_TOKEN=figd_xxx node scripts/check-figma-version.mjs --any    # 종전 동작(저장 기준, 디버깅용)
 *   FIGMA_TOKEN=figd_xxx node scripts/check-figma-version.mjs --record # 현재 발행 version 을 매니페스트에 기록(동기화 완료 후)
 *   node scripts/check-figma-version.mjs --record <version>
 *     # 지정한 version 으로 고정 기록(API 재조회 없음) — 감지 시점의 버전을 그대로
 *     # 기록해, 감지~기록 사이에 낀 새 변경이 워터마크에 삼켜지는 TOCTOU 를 방지.
 *
 * 종료 코드: 0 = 최신(변경 없음) / 10 = 변경됨 / 2 = 오류
 * (스케줄러/CI 가 코드로 분기할 수 있게 설계)
 *
 * 토큰 발급: figma.com → Settings → Security → Personal access tokens
 *           (scope: File content = read). 절대 커밋하지 말 것.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MANIFEST = join(__dirname, "..", "figma.manifest.json");

function fail(msg) {
  console.error(`[check-figma] ✗ ${msg}`);
  process.exit(2);
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
} catch (e) {
  fail(`매니페스트를 읽지 못했습니다: ${e.message}`);
}

const fileKey = manifest.fileKey;
if (!fileKey) fail("매니페스트에 fileKey 가 없습니다.");

// --record <version>: 명시 버전 고정 기록 — API 조회 없이(토큰 불필요) 즉시 기록하고 종료.
// (라이브 재조회로 기록하면 감지~기록 사이의 새 변경까지 "동기화됨"이 되는 레이스가 있다)
const ri = process.argv.indexOf("--record");
const explicitVersion =
  ri !== -1 && process.argv[ri + 1] && !process.argv[ri + 1].startsWith("--")
    ? process.argv[ri + 1]
    : undefined;
if (explicitVersion) {
  manifest.lastSyncedVersion = explicitVersion;
  manifest.lastSyncedAt = new Date().toISOString();
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`[check-figma] ✓ recorded version=${explicitVersion} (명시 고정)`);
  process.exit(0);
}

const token = process.env.FIGMA_TOKEN;
if (!token) {
  fail(
    "FIGMA_TOKEN 환경변수가 없습니다. figma.com → Settings → Security 에서 Personal access token(File content: read)을 발급해 설정하세요."
  );
}

function humanizeSeconds(s) {
  if (!Number.isFinite(s) || s <= 0) return null;
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  const d = (s / 86400).toFixed(1);
  return h >= 24 ? `${d}일(${h}시간)` : `${h}시간 ${m}분`;
}

/**
 * 가벼운 엔드포인트: GET /v1/files/:key/versions (버전 메타데이터만).
 * IMPORTANT: 무거운 GET /v1/files/:key 는 비용 기반 리밋이 커서 폴링 금지.
 * 429 시 자동 재시도하지 않는다(비용 폭주 방지) — Retry-After 만 알리고 종료.
 *
 * page_size=50 — **이름 붙은(발행) 버전**을 찾으려면 뒤쪽 autosave 들을 건너뛰어야 한다.
 * 마지막 발행 이후 autosave 가 50개를 넘으면 라벨을 못 찾지만, 그건 "새 발행이 없다"는
 * 뜻이므로 exit 0(변경 없음)이 올바른 동작이다.
 */
const res = await fetch(
  `https://api.figma.com/v1/files/${fileKey}/versions?page_size=50`,
  { headers: { "X-Figma-Token": token } }
).catch((e) => fail(`네트워크 오류: ${e.message}`));

if (res.status === 429) {
  const ra = Number(res.headers.get("retry-after"));
  const human = humanizeSeconds(ra);
  fail(
    `429 rate limited. ${human ? `약 ${human} 후 재시도 가능(Retry-After=${ra}s).` : "잠시 후 재시도."} ` +
      "자동 재시도하지 않음(비용 폭주 방지). 폴링 주기를 시간/일 단위로 낮추거나 webhook 사용 권장."
  );
}
if (!res.ok) {
  fail(`Figma API ${res.status} ${res.statusText} (토큰/파일권한 확인)`);
}

const data = await res.json();
const versions = data.versions || [];
// versions[0] = 최신(무명 autosave 포함)
const live = versions[0] || {};
// ★ 릴리즈 = **이름 붙은 버전**. Figma 는 라이브러리 publish 시 "Components published"
//   라벨을 자동 생성하고, 사람이 직접 이름을 붙일 수도 있다. 무명 autosave 는 작업 중
//   상태이므로 릴리즈로 취급하지 않는다.
const release = versions.find((v) => v.label) || null;

// --any: 종전 동작(발행 여부 무시하고 최신 저장 기준). 수동 점검/디버깅용.
const anyMode = process.argv.includes("--any");
const target = anyMode ? live : release;

const currentVersion = target?.id;
const lastModified = target?.created_at;
const lastSynced = manifest.lastSyncedVersion;
const lastSyncedAt = manifest.lastSyncedAt;

/**
 * 변경 판정 — id 가 다르면서 **더 최신**일 때만 "변경".
 * 시각 비교를 함께 보는 이유: 발행 게이트 도입 전엔 워터마크에 autosave id 가 기록돼
 * 있어, id 만 비교하면 그보다 오래된 발행본으로 되돌아가는 역행 sync 가 일어난다.
 */
let changed = false;
if (currentVersion) {
  const idDiffers = String(currentVersion) !== String(lastSynced);
  const newer =
    lastModified && lastSyncedAt
      ? new Date(lastModified) > new Date(lastSyncedAt)
      : true; // 타임스탬프가 없으면 id 비교만으로 판단
  changed = idDiffers && newer;
}

// --record: 현재 version 을 매니페스트에 기록(동기화 성공 후 호출)
if (process.argv.includes("--record")) {
  if (!currentVersion) fail("기록할 버전이 없습니다(발행된 버전 미발견).");
  manifest.lastSyncedVersion = currentVersion;
  manifest.lastSyncedAt = lastModified || new Date().toISOString();
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`[check-figma] ✓ recorded version=${currentVersion}`);
  process.exit(0);
}

if (!release && !anyMode) {
  console.log(
    JSON.stringify({ changed: false, reason: "no-published-version" }, null, 2)
  );
  console.log(
    `[check-figma] ✓ 발행된 버전 없음 — 최근 ${versions.length}개가 전부 무명 autosave. ` +
      "(Figma 에서 라이브러리를 publish 하거나 버전에 이름을 붙이면 릴리즈로 감지됩니다.)"
  );
  process.exit(0);
}

const result = {
  changed,
  releaseLabel: target?.label ?? null,
  liveVersion: live.id,
  liveModified: live.created_at,
  currentVersion,
  lastSyncedVersion: lastSynced,
  lastModified,
  fileName: data.name,
};
console.log(JSON.stringify(result, null, 2));
const pending =
  !anyMode && live.id && String(live.id) !== String(currentVersion)
    ? ` (미발행 작업분 있음 — live=${live.id})`
    : "";
console.log(
  changed
    ? `[check-figma] ⚠ 새 발행 감지: ${lastSynced ?? "(없음)"} → ${currentVersion}` +
        (target?.label ? ` "${target.label}"` : "") +
        ". /sync-figma 실행 필요."
    : `[check-figma] ✓ 최신 상태 (발행 version=${currentVersion})${pending}.`
);
process.exit(changed ? 10 : 0);
