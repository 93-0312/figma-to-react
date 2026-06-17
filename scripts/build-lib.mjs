#!/usr/bin/env node
/**
 * npm 라이브러리 빌드 (dist/).
 *   1) Vite lib   → dist/index.js (ESM 번들, react/cva/clsx/tailwind-merge external)
 *   2) tsc        → dist/**.d.ts (타입 선언)
 *   3) Tailwind   → dist/styles.css (토큰 + 컴포넌트가 쓰는 유틸만)
 * 새 의존성 없이 기존 vite/tsc/tailwindcss 만 사용.
 */
import { rmSync, readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const run = (cmd) => execSync(cmd, { stdio: "inherit", shell: true });

console.log("» clean dist");
rmSync("dist", { recursive: true, force: true });

console.log("» build JS (vite lib)");
run("vite build --config vite.lib.config.ts");

console.log("» build types (tsc)");
run("tsc -p tsconfig.lib.json");

console.log("» build CSS (tailwind)");
run(
  "npx tailwindcss -c tailwind.lib.config.js -i lib/styles.css -o dist/_utilities.css --minify"
);
const tokens = readFileSync("src/tokens.css", "utf8");
const utilities = readFileSync("dist/_utilities.css", "utf8");
writeFileSync(
  "dist/styles.css",
  `/* bo-ui-kit — 디자인 토큰 + 컴포넌트 유틸리티 */\n${tokens}\n${utilities}`
);
rmSync("dist/_utilities.css", { force: true });

console.log("✓ dist 빌드 완료 (index.js + *.d.ts + styles.css)");
