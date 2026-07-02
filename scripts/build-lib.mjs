#!/usr/bin/env node
/**
 * npm 라이브러리 빌드 (dist/).
 *   1) Vite lib   → dist/index.js (ESM 번들, react/cva/clsx/tailwind-merge external)
 *   2) tsc        → dist/**.d.ts (타입 선언)
 *   2b) 후처리    → 상대 import 에 명시적 .js 확장자(node16 해석) + .d.cts 쌍둥이(CJS 소비자 타입)
 *                  + 루트 dist/index.d.ts / index.d.cts 스텁. 검증: npx @arethetypeswrong/cli --pack
 *   3) Tailwind   → dist/styles.css (토큰 + 컴포넌트가 쓰는 유틸만)
 * 새 의존성 없이 기존 vite/tsc/tailwindcss 만 사용.
 */
import { rmSync, readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { execSync } from "node:child_process";

const run = (cmd) => execSync(cmd, { stdio: "inherit", shell: true });

console.log("» clean dist");
rmSync("dist", { recursive: true, force: true });

console.log("» build JS (vite lib)");
run("vite build --config vite.lib.config.ts");

console.log("» build types (tsc)");
run("tsc -p tsconfig.lib.json");

console.log("» postprocess types (node16 확장자 + CJS .d.cts)");
// tsc 는 소스의 확장자 없는 상대 import("./button")를 그대로 emit 한다. 이는
// moduleResolution: node16/nodenext 소비자에서 Internal resolution error 가 되므로
// 명시적 확장자로 재작성한다("./button.js" → 이웃 .d.ts 로 해석됨).
// 또한 type:"module" 패키지의 .d.ts 는 ESM 취급이라 require("bo-ui-kit") 쪽 타입이
// 없으면 node16 CJS TS 소비자에서 "Masquerading as ESM" — .cjs specifier 를 쓰는
// .d.cts 쌍둥이 트리를 함께 생성한다.
const dtsFiles = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".d.ts")) dtsFiles.push(p);
  }
})("dist");

// `from "./x"` / `import("./x")` 형태의 상대 specifier 만 대상 (bare specifier 제외)
const RELATIVE_SPEC = /((?:from|import)\s*\(?\s*)(["'])(\.\.?\/[^"']+)\2/g;
const withExt = (file, spec, ext) => {
  const dir = dirname(file);
  if (existsSync(join(dir, `${spec}.d.ts`))) return `${spec}${ext}`;
  if (existsSync(join(dir, spec, "index.d.ts"))) return `${spec}/index${ext}`;
  return spec; // 이미 확장자가 있거나 대상 없음 — 그대로 둔다
};
for (const f of dtsFiles) {
  const src = readFileSync(f, "utf8");
  const rewrite = (ext) =>
    src.replace(RELATIVE_SPEC, (_m, pre, q, spec) => `${pre}${q}${withExt(f, spec, ext)}${q}`);
  writeFileSync(f, rewrite(".js"));
  writeFileSync(f.replace(/\.d\.ts$/, ".d.cts"), rewrite(".cjs"));
}

// 배포 엔트리 스텁 — exports "." 의 import/require types 가 각각 이를 가리킨다.
writeFileSync("dist/index.d.ts", `export * from "./components/ui/index.js";\n`);
writeFileSync("dist/index.d.cts", `export * from "./components/ui/index.cjs";\n`);

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
