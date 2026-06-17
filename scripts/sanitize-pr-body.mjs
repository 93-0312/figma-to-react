#!/usr/bin/env node
/**
 * PR 본문의 "백틱 없는 @멘션"을 백틱으로 감싸 GitHub @멘션 알림을 무력화한다(결정적, 멱등).
 *
 * 배경: PR/커밋/이슈 본문의 `@이름`(단어 경계 뒤)을 GitHub 이 @멘션으로 해석해 그 계정에
 *       알림 메일을 보낸다(과거 사고: `@eromnet` → it@eromnet.com 팀 별칭). 패키지는 unscoped
 *       로 바꿔 트리거를 없앴지만, 이 스크립트는 혹시 모를 잔여 멘션을 자동 정리하는 백스톱이다.
 *
 * 처리: `@name` → `` `@name` `` (코드 스팬은 멘션으로 안 읽힘).
 *   - 이메일(`it@eromnet.com`)은 `@` 앞에 글자가 있어 매칭 안 됨(안전).
 *   - 이미 백틱된 `` `@name` `` 은 `@` 앞이 백틱이라 매칭 안 됨(멱등).
 *
 * 사용: GITHUB_REPOSITORY 환경변수 + GH_TOKEN 인증 하에 `node sanitize-pr-body.mjs <PR번호>`
 */
import { execSync } from "node:child_process";

const pr = process.argv[2];
const repo = process.env.GITHUB_REPOSITORY;
if (!pr || !repo) {
  console.error("usage: sanitize-pr-body.mjs <pr#>  (GITHUB_REPOSITORY env 필요)");
  process.exit(1);
}
const sh = (cmd, opts = {}) => execSync(cmd, { encoding: "utf8", ...opts });

let body;
try {
  body = sh(`gh pr view ${pr} --repo ${repo} --json body -q .body`);
} catch (e) {
  console.error(`PR #${pr} 본문 조회 실패: ${e.message}`);
  process.exit(0); // 조회 실패는 게이트 막지 않음
}

// @ 가 단어 경계(줄머리/공백/여는괄호·꺾쇠·대괄호) 뒤 + 백틱이 아닌 경우만. 이메일·백틱은 제외.
const RE = /(^|[\s(>\[])@([A-Za-z0-9][A-Za-z0-9-]{0,38})\b/g;
let count = 0;
const fixed = body.replace(RE, (_m, pre, name) => {
  count++;
  return `${pre}\`@${name}\``;
});

if (count > 0 && fixed !== body) {
  sh(`gh pr edit ${pr} --repo ${repo} --body-file -`, { input: fixed });
  console.log(`✓ PR #${pr}: 백틱 없는 @멘션 ${count}건 무력화(백틱 처리).`);
} else {
  console.log(`✓ PR #${pr}: 멘션 위험 없음.`);
}
