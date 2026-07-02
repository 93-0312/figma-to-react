#!/usr/bin/env node
/**
 * Phase 1 — Figma 변경 감지 (플랜 무관: 모든 플랜에서 PAT 로 동작)
 *
 * Figma REST `GET /v1/files/:key?depth=1` 로 현재 파일 `version` 을 읽어
 * figma.manifest.json 의 `lastSyncedVersion` 과 비교한다.
 *
 * 사용:
 *   FIGMA_TOKEN=figd_xxx node scripts/check-figma-version.mjs          # 감지만
 *   FIGMA_TOKEN=figd_xxx node scripts/check-figma-version.mjs --record # 현재 version 을 매니페스트에 기록(동기화 완료 후)
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
 */
const res = await fetch(
  `https://api.figma.com/v1/files/${fileKey}/versions?page_size=1`,
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
// versions[0] = 최신 버전
const latest = (data.versions && data.versions[0]) || {};
const currentVersion = latest.id;
const lastModified = latest.created_at;
const lastSynced = manifest.lastSyncedVersion;
const changed = String(currentVersion) !== String(lastSynced);

// --record: 현재 version 을 매니페스트에 기록(동기화 성공 후 호출)
if (process.argv.includes("--record")) {
  manifest.lastSyncedVersion = currentVersion;
  manifest.lastSyncedAt = lastModified || new Date().toISOString();
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`[check-figma] ✓ recorded version=${currentVersion}`);
  process.exit(0);
}

const result = {
  changed,
  currentVersion,
  lastSyncedVersion: lastSynced,
  lastModified,
  fileName: data.name,
};
console.log(JSON.stringify(result, null, 2));
console.log(
  changed
    ? `[check-figma] ⚠ 변경 감지: ${lastSynced ?? "(없음)"} → ${currentVersion}. /sync-figma 실행 필요.`
    : `[check-figma] ✓ 최신 상태 (version=${currentVersion}).`
);
process.exit(changed ? 10 : 0);
