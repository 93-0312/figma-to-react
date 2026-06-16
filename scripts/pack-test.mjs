#!/usr/bin/env node
/**
 * examples/pack-consumer 에 **실제 배포 tarball 만** 설치한다(심볼릭 링크 배제).
 *   1) npm pack  → prepack(build:lib) 자동 실행 후 .tgz 생성
 *   2) tarball 을 examples/pack-consumer/bo-ui-kit.tgz 로 고정 이름 배치
 *   3) 해당 폴더에서 신선 설치(node_modules/lock 정리 후) → file:./bo-ui-kit.tgz 설치
 * 이후 `node examples/pack-consumer/smoke.mjs` 로 검증.
 */
import { execSync } from "node:child_process";
import { readdirSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";

const DIR = "examples/pack-consumer";
const run = (cmd, opts = {}) => execSync(cmd, { stdio: "inherit", shell: true, ...opts });

console.log("» npm pack (prepack=build:lib 자동)");
for (const f of readdirSync(DIR)) if (f.endsWith(".tgz")) rmSync(join(DIR, f), { force: true });
run(`npm pack --pack-destination ${DIR}`);

const tgz = readdirSync(DIR).find((f) => /^eromnet-bo-ui-kit-.*\.tgz$/.test(f));
if (!tgz) { console.error("❌ tarball 생성 실패"); process.exit(1); }
renameSync(join(DIR, tgz), join(DIR, "bo-ui-kit.tgz"));
console.log(`» tarball → ${DIR}/bo-ui-kit.tgz`);

console.log("» 신선 설치 (심볼릭 링크 없이 tarball 만)");
rmSync(join(DIR, "node_modules"), { recursive: true, force: true });
rmSync(join(DIR, "package-lock.json"), { force: true });
run("npm install", { cwd: DIR });

console.log("✓ pack-consumer: tarball 설치 완료 — 이제 smoke.mjs 로 검증");
