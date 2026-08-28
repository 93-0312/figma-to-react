#!/usr/bin/env node
/**
 * Variant 커버리지 게이트 (결정적 — Claude 미사용).
 *
 * ★ 왜 필요한가 — 기존 파이프라인은 **델타(변경) 감지**만 한다.
 *   `check-figma-nodes.mjs` 는 노드 서브트리 해시를 이전 지문과 비교하므로
 *   "지난번과 뭐가 달라졌나"만 답한다. **"Figma 에 있는데 코드가 구현 안 한 게 있나"**
 *   는 아무도 묻지 않는다. 그래서 처음부터 존재했고 한 번도 바뀌지 않은 variant 는
 *   영원히 감지되지 않는다 — 실제로 Input 의 `Type=File` 이 그렇게 몇 달간 묻혔다.
 *   이 스크립트가 그 사각지대를 담당한다.
 *
 * 하는 일: 추적 노드를 Figma 에서 읽어 **live variant 축/값**을 추출하고,
 *   ① 매니페스트에 기록된 `variants` 와 대조해 **드리프트**(새 variant 등장/제거)를 찾고
 *   ② `variantCoverage` 에 명시적으로 처리 근거가 없는 값을 **미선언**으로 보고한다.
 *
 * 매니페스트 규약:
 *   "variants":        { "type": ["Default", ...], "size": [...] }   // 최근 스냅샷(--record 로 갱신)
 *   "variantCoverage": { "type=File": "src/components/ui/file-input.tsx",
 *                        "type=MultiSelect": "n/a: Figma 미완성 — 칩 디자인 없음" }
 *   → 값이 `n/a:` 로 시작하면 "의도적 미구현(사유 명시)", 그 외에는 구현 위치로 본다.
 *
 * 사용:
 *   FIGMA_TOKEN=... node scripts/check-variant-coverage.mjs           # 드리프트 검사
 *   FIGMA_TOKEN=... node scripts/check-variant-coverage.mjs --audit   # 전수 감사(미선언 전부 보고)
 *   FIGMA_TOKEN=... node scripts/check-variant-coverage.mjs --record  # 현재 live variant 를 매니페스트에 기록
 *   ... --version <id>                                                # 발행 스냅샷 고정 조회
 *
 * 종료 코드: 0 = 이상 없음 / 10 = 드리프트·미선언 발견 / 2 = 오류
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MANIFEST = join(__dirname, "..", "figma.manifest.json");

const fail = (m) => {
  console.error(`[variant-coverage] ✗ ${m}`);
  process.exit(2);
};

const argv = process.argv;
const has = (f) => argv.includes(f);
const argOf = (f) => {
  const i = argv.indexOf(f);
  return i !== -1 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : undefined;
};

let manifest;
try {
  manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
} catch (e) {
  fail(`매니페스트를 읽지 못했습니다: ${e.message}`);
}
const { fileKey, components = [] } = manifest;
if (!fileKey || !components.length) fail("fileKey/components 가 비어 있습니다.");

const token = process.env.FIGMA_TOKEN;
if (!token) fail("FIGMA_TOKEN 환경변수가 없습니다.");

const pinned = argOf("--version");
const ids = components.map((c) => c.figmaNodeId);
const url =
  `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(ids.join(","))}` +
  `&depth=2${pinned ? `&version=${encodeURIComponent(pinned)}` : ""}`;

const res = await fetch(url, { headers: { "X-Figma-Token": token } }).catch((e) =>
  fail(`네트워크 오류: ${e.message}`)
);
if (res.status === 429) fail("429 rate limited — 자동 재시도 안 함.");
if (!res.ok) fail(`Figma API ${res.status} ${res.statusText}`);
const data = await res.json();

/** "Type=File, Size=Default" → { Type: "File", Size: "Default" } */
const parseVariantName = (name) =>
  Object.fromEntries(
    String(name)
      .split(",")
      .map((p) => p.trim().split("="))
      .filter((kv) => kv.length === 2)
      .map(([k, v]) => [k.trim(), v.trim()])
  );

/** Figma 축 이름(Type/IsSelected) → 매니페스트 키(type/isSelected) */
const axisKey = (s) => (s.charAt(0).toLowerCase() + s.slice(1)).replace(/[?]+$/, "");
/** 값 정규화 — 매니페스트는 boolean 을 쓰기도 한다 */
const normVal = (v) => {
  const s = String(v);
  if (/^true$/i.test(s)) return "true";
  if (/^false$/i.test(s)) return "false";
  return s;
};

const auditMode = has("--audit");
const report = [];
const liveByComponent = {};

for (const c of components) {
  const doc = data.nodes?.[c.figmaNodeId]?.document;
  if (!doc) {
    report.push({ name: c.name, kind: "노드없음", detail: `${c.figmaNodeId} 응답에 없음(삭제/이름변경?)` });
    continue;
  }
  if (doc.type !== "COMPONENT_SET") continue; // 단일 컴포넌트는 variant 축이 없다

  // live 축 수집
  const axes = {};
  for (const child of doc.children || []) {
    for (const [k, v] of Object.entries(parseVariantName(child.name))) {
      (axes[axisKey(k)] ||= new Set()).add(v);
    }
  }
  const live = Object.fromEntries(Object.entries(axes).map(([k, s]) => [k, [...s]]));
  liveByComponent[c.figmaNodeId] = live;

  const recorded = c.variants || {};
  const coverage = c.variantCoverage || {};

  for (const [axis, values] of Object.entries(live)) {
    const rec = (recorded[axis] || []).map(normVal);
    for (const v of values) {
      const key = `${axis}=${v}`;
      const declared = coverage[key];
      const known = rec.includes(normVal(v));

      if (!known) {
        // 매니페스트가 모르는 값 = Figma 에 새로 생겼거나 애초에 기록 안 됨
        report.push({
          name: c.name,
          kind: recorded[axis] ? "신규variant" : "미기록축",
          detail: `${key}${declared ? ` (선언: ${declared})` : ""}`,
        });
      } else if (auditMode && !declared) {
        report.push({ name: c.name, kind: "미선언", detail: key });
      }
    }
    // Figma 에서 사라진 값
    for (const v of rec) {
      if (!values.map(normVal).includes(v)) {
        report.push({ name: c.name, kind: "제거됨", detail: `${axis}=${v} (Figma 에 없음)` });
      }
    }
  }
}

// --record: live variant 를 매니페스트에 기록
if (has("--record")) {
  let n = 0;
  for (const c of components) {
    const live = liveByComponent[c.figmaNodeId];
    if (!live || !Object.keys(live).length) continue;
    c.variants = live;
    n++;
  }
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`[variant-coverage] ✓ ${n}개 컴포넌트의 live variant 기록`);
  process.exit(0);
}

const byKind = report.reduce((a, r) => ((a[r.kind] ||= []).push(r), a), {});
console.log(
  JSON.stringify(
    { mode: auditMode ? "audit" : "drift", total: report.length, byKind: Object.fromEntries(Object.entries(byKind).map(([k, v]) => [k, v.length])) },
    null,
    2
  )
);
for (const [kind, items] of Object.entries(byKind)) {
  console.log(`\n[${kind}] ${items.length}건`);
  for (const it of items) console.log(`  - ${it.name}: ${it.detail}`);
}
if (!report.length) console.log("\n[variant-coverage] ✓ 모든 Figma variant 가 매니페스트에 반영돼 있습니다.");

process.exit(report.length ? 10 : 0);
