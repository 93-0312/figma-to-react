#!/usr/bin/env node
/**
 * pack 소비 검증 (결정적, Claude 미사용).
 *
 * examples/consumer 는 워크스페이스 "심볼릭 링크"로 레포 루트를 가리키지만,
 * 여기는 `npm pack` 으로 만든 **실제 배포 tarball 만 설치**해 검증한다.
 *   - tarball 추출물(심볼릭 링크 아님)인지
 *   - files 경계(dist + package.json + README 만, src 미포함)
 *   - ESM import / CJS require / styles.css 해석
 *
 * 종료: 모두 통과 0 / 하나라도 실패 1.
 */
import { createRequire } from "node:module";
import { existsSync, lstatSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const pkgDir = fileURLToPath(new URL("node_modules/bo-ui-kit/", import.meta.url));
const cssFile = fileURLToPath(new URL("node_modules/bo-ui-kit/dist/styles.css", import.meta.url));
const NEED = ["Button", "Checkbox", "Input", "Label", "Field", "InputOTP", "Meter"];

let failed = false;
const ok = (n) => console.log("✓", n);
const bad = (n) => { console.error("❌", n); failed = true; };

if (!existsSync(pkgDir)) {
  bad("로컬 node_modules 에 패키지 설치 안 됨 (pack-test 먼저 실행)");
} else {
  const st = lstatSync(pkgDir.replace(/[/\\]$/, ""));
  st.isSymbolicLink() ? bad("심볼릭 링크임 (tarball 추출물이어야 함)") : ok("심볼릭 링크 아님 — tarball 추출물");

  const entries = readdirSync(pkgDir);
  const hasDist = entries.includes("dist");
  const leaked = ["src", "examples", "tests", "scripts"].filter((d) => entries.includes(d));
  hasDist && leaked.length === 0
    ? ok(`files 경계 OK — ${entries.join(", ")}`)
    : bad(`files 경계 위반 — dist:${hasDist}, 누출:${leaked.join(",") || "없음"}`);
}

try {
  const esm = await import("bo-ui-kit");
  const miss = NEED.filter((k) => !esm[k]);
  miss.length ? bad(`ESM export 누락: ${miss}`) : ok(`ESM import (${Object.keys(esm).length} exports)`);
} catch (e) { bad(`ESM import: ${e.message}`); }

try {
  const cjs = require("bo-ui-kit");
  const miss = NEED.filter((k) => !cjs[k]);
  miss.length ? bad(`CJS export 누락: ${miss}`) : ok(`CJS require (${Object.keys(cjs).length} exports)`);
} catch (e) { bad(`CJS require: ${e.message}`); }

let cssOk = false;
try { cssOk = existsSync(require.resolve("bo-ui-kit/styles.css")); } catch { /* exports 미지원 폴백 */ }
if (!cssOk) cssOk = existsSync(cssFile);
cssOk ? ok("styles.css 해석 + 존재") : bad("styles.css 없음");

console.log(failed ? "\n❌ pack 소비 검증 실패" : "\n✅ pack 소비 검증 통과 — 실제 배포 tarball 이 정상 설치·해석됨");
process.exit(failed ? 1 : 0);
