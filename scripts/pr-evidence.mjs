#!/usr/bin/env node
/**
 * PR 시각 증거 수집 (결정적 — Claude 미사용).
 *
 * `npm run test:visual` 실행 후 호출. Playwright 가 변경된 컴포넌트에 대해 남긴
 * `<name>-expected.png`(before) / `-actual.png`(after) / `-diff.png` 를 모으고,
 * 해당 컴포넌트의 Figma 노드 이미지(REST /v1/images)를 받아 `evidence/<name>/` 에 정리한다.
 * 또한 PR 코멘트용 마크다운(`evidence/comment.md`)을 만든다(이미지 URL 은 `__BASE__` 플레이스홀더).
 *
 * 변경된 컴포넌트가 없으면 comment.md 를 비워 둔다(코멘트 생략 신호).
 */
import {
  readdirSync,
  statSync,
  existsSync,
  mkdirSync,
  copyFileSync,
  writeFileSync,
  readFileSync,
} from "node:fs";
import { join } from "node:path";

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const manifest = JSON.parse(readFileSync("figma.manifest.json", "utf8"));
const fileKey = manifest.fileKey;
const nodeByName = Object.fromEntries(
  manifest.components.map((c) => [c.name, c.figmaNodeId])
);

const RESULTS = "test-results";
const EVIDENCE = "evidence";
mkdirSync(EVIDENCE, { recursive: true });

// test-results/ 전체를 훑어 `*-diff.png` 를 찾는다 → 변경된 컴포넌트
function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith("-diff.png")) out.push(p);
  }
  return out;
}

async function fetchFigma(name, nodeId, outPath) {
  if (!nodeId || !FIGMA_TOKEN) return false;
  try {
    const r = await fetch(
      `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(
        nodeId
      )}&format=png&scale=2`,
      { headers: { "X-Figma-Token": FIGMA_TOKEN } }
    );
    if (!r.ok) return false;
    const j = await r.json();
    const url = j.images && j.images[nodeId];
    if (!url) return false;
    const img = await fetch(url);
    if (!img.ok) return false;
    writeFileSync(outPath, Buffer.from(await img.arrayBuffer()));
    return true;
  } catch {
    return false;
  }
}

const diffs = walk(RESULTS);
const changed = [];

for (const diffPath of diffs) {
  const dir = diffPath.slice(0, diffPath.lastIndexOf("/") >= 0 ? diffPath.lastIndexOf("/") : diffPath.lastIndexOf("\\"));
  const base = diffPath.split(/[\\/]/).pop().replace(/-diff\.png$/, ""); // "Button"
  const expected = join(dir, `${base}-expected.png`);
  const actual = join(dir, `${base}-actual.png`);
  const out = join(EVIDENCE, base);
  mkdirSync(out, { recursive: true });
  if (existsSync(expected)) copyFileSync(expected, join(out, "before.png"));
  if (existsSync(actual)) copyFileSync(actual, join(out, "after.png"));
  copyFileSync(diffPath, join(out, "diff.png"));
  const figmaOk = await fetchFigma(base, nodeByName[base], join(out, "figma.png"));
  changed.push({ name: base, figmaOk, hasBefore: existsSync(expected) });
}

let md = "";
if (changed.length) {
  md += "## 🎨 동기화 시각 증거\n\n";
  md += "디자인 원본(Figma)과 코드 렌더 변화를 함께 표시합니다. *Figma 는 렌더러가 달라 참고용이며, 합격/불합격 판정은 Before/After diff 기준입니다.*\n\n";
  for (const c of changed) {
    md += `### ${c.name}\n\n`;
    md += "| 🎨 Figma 원본 | 🖼 Before | 🖼 After | 🔴 Diff |\n|---|---|---|---|\n";
    const fig = c.figmaOk
      ? `<img src="__BASE__/${c.name}/figma.png" width="200">`
      : "_(Figma 이미지 없음)_";
    const before = c.hasBefore
      ? `<img src="__BASE__/${c.name}/before.png" width="200">`
      : "_(baseline 없음)_";
    md += `| ${fig} | ${before} | <img src="__BASE__/${c.name}/after.png" width="200"> | <img src="__BASE__/${c.name}/diff.png" width="200"> |\n\n`;
  }
}
writeFileSync(join(EVIDENCE, "comment.md"), md);
console.log(`[pr-evidence] 변경 컴포넌트: ${changed.map((c) => c.name).join(", ") || "없음"}`);
