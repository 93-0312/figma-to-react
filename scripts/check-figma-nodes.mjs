#!/usr/bin/env node
/**
 * 노드 단위 변경 감지 (결정적 — Claude 미사용).
 *
 * 파일 version 만 보면 autosave(무관한 편집)도 "변경"으로 잡혀, 헤드리스 sync 가
 * 헛돌고 좀비 이슈가 생긴다. 이 스크립트는 **추적 중인 컴포넌트 노드의 실제 내용**을
 * 해시해 직전 동기화 상태(figma.fingerprints.json)와 비교한다.
 * → 컴포넌트가 실제로 바뀐 경우에만 sync 를 트리거하도록, poll 의 2차 게이트로 쓴다.
 *
 * 비용: `GET /v1/files/:key/nodes?ids=...` 1회(헤비). version 이 바뀐 경우에만 호출하므로
 *       폴링마다 부르지 않는다. 429 면 재시도하지 않고 종료(비용 폭주 방지).
 *
 * 사용:
 *   FIGMA_TOKEN=... node scripts/check-figma-nodes.mjs           # 감지 (exit 0/10/2)
 *   FIGMA_TOKEN=... node scripts/check-figma-nodes.mjs --record  # 현재 지문을 sidecar 에 기록
 *
 * 종료 코드: 0 = 컴포넌트 변경 없음 / 10 = 변경됨 / 2 = 오류
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MANIFEST = join(__dirname, "..", "figma.manifest.json");
const SIDECAR = join(__dirname, "..", "figma.fingerprints.json");

function fail(msg) {
  console.error(`[check-figma-nodes] ✗ ${msg}`);
  process.exit(2);
}

const token = process.env.FIGMA_TOKEN;
if (!token) fail("FIGMA_TOKEN 환경변수가 없습니다.");

let manifest;
try {
  manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
} catch (e) {
  fail(`매니페스트를 읽지 못했습니다: ${e.message}`);
}
const fileKey = manifest.fileKey;
const comps = manifest.components || [];
if (!fileKey || comps.length === 0) fail("fileKey/components 가 비어 있습니다.");

const ids = comps.map((c) => c.figmaNodeId);
const res = await fetch(
  `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(
    ids.join(",")
  )}`,
  { headers: { "X-Figma-Token": token } }
).catch((e) => fail(`네트워크 오류: ${e.message}`));

if (res.status === 429) {
  const ra = res.headers.get("retry-after");
  fail(`429 rate limited (Retry-After=${ra}s). 자동 재시도 안 함.`);
}
if (!res.ok) fail(`Figma API ${res.status} ${res.statusText}`);

const data = await res.json();

// 노드별 지문(document 서브트리 해시). 동일 내용은 동일 해시(실측으로 안정성 확인됨).
const current = {};
for (const c of comps) {
  const doc = data.nodes?.[c.figmaNodeId]?.document;
  current[c.figmaNodeId] = doc
    ? createHash("sha256").update(JSON.stringify(doc)).digest("hex")
    : null; // 노드가 응답에 없음 = 삭제/이름변경 등 구조 변경
}

// --record: 현재 지문을 sidecar 에 기록(동기화 완료 후 호출)
if (process.argv.includes("--record")) {
  writeFileSync(SIDECAR, JSON.stringify(current, null, 2) + "\n");
  console.log(`[check-figma-nodes] ✓ 지문 기록 (${comps.length}개 노드) → figma.fingerprints.json`);
  process.exit(0);
}

let prev = {};
if (existsSync(SIDECAR)) {
  try {
    prev = JSON.parse(readFileSync(SIDECAR, "utf8"));
  } catch {
    /* 손상 시 전부 변경으로 취급 */
  }
} else {
  console.error("[check-figma-nodes] ⚠ sidecar 없음 — 비교 기준 없음, 변경으로 취급");
}

const changed = [];
for (const c of comps) {
  if (current[c.figmaNodeId] !== prev[c.figmaNodeId]) changed.push(c.name);
}

console.log(
  JSON.stringify({ changed: changed.length > 0, changedComponents: changed }, null, 2)
);
console.log(
  changed.length
    ? `[check-figma-nodes] ⚠ 컴포넌트 변경: ${changed.join(", ")}`
    : `[check-figma-nodes] ✓ 컴포넌트 변경 없음 (autosave/무관 편집)`
);
process.exit(changed.length ? 10 : 0);
