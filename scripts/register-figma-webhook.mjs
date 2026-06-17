/**
 * Figma 웹훅(FILE_UPDATE) 등록/조회/삭제 — 1회성 운영 스크립트.
 *
 * Cloudflare Worker(중계자)를 배포해 공개 URL 을 얻은 뒤 실행한다.
 *
 * 사용법 (레포 루트):
 *   # .env 의 FIGMA_TOKEN 사용. ENDPOINT/PASSCODE 는 인자 또는 env 로 전달.
 *   node scripts/register-figma-webhook.mjs list
 *   node scripts/register-figma-webhook.mjs create --endpoint https://figma-webhook-relay.xxx.workers.dev --passcode <비밀>
 *   node scripts/register-figma-webhook.mjs delete <webhook_id>
 *
 * 환경:
 *   FIGMA_TOKEN     (필수, .env)         — webhooks 권한 보유 토큰
 *   FIGMA_FILE_KEY  (기본 BO UI Kit 파일) — 웹훅을 걸 파일
 *   WEBHOOK_ENDPOINT / --endpoint        — Worker 공개 URL
 *   WEBHOOK_PASSCODE / --passcode        — Worker 의 FIGMA_PASSCODE 와 동일해야 함
 *
 * 주의: passcode 는 Cloudflare(`wrangler secret put FIGMA_PASSCODE`)와 **같은 값**이어야
 *      Worker 가 요청을 통과시킨다.
 */
import { readFileSync } from "node:fs";

// .env 로드(간단 파서; dotenv 의존 회피).
try {
  for (const line of readFileSync(new URL("../.env", import.meta.url), "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  /* .env 없으면 환경변수만 사용 */
}

const TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY || "LFA5EyNbUdPvi8Rbuf2tJC";
const API = "https://api.figma.com/v2/webhooks";

if (!TOKEN) {
  console.error("❌ FIGMA_TOKEN 이 없습니다(.env 또는 환경변수).");
  process.exit(1);
}

// --flag value 형태 인자 파싱.
const argv = process.argv.slice(2);
const cmd = argv[0];
const getFlag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
};

const headers = { "X-Figma-Token": TOKEN, "Content-Type": "application/json" };

async function api(method, url, body) {
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { ok: res.ok, status: res.status, json };
}

async function list() {
  const { ok, status, json } = await api(
    "GET",
    `${API}?context=file&context_id=${FILE_KEY}`
  );
  if (!ok) {
    console.error(`❌ list 실패 HTTP ${status}:`, json);
    process.exit(1);
  }
  const hooks = json.webhooks || [];
  console.log(`📋 file ${FILE_KEY} 의 웹훅 ${hooks.length}개:`);
  for (const h of hooks) {
    console.log(`  - id=${h.id} status=${h.status} event=${h.event_type}\n    endpoint=${h.endpoint}`);
  }
  return hooks;
}

async function create() {
  const endpoint = getFlag("endpoint") || process.env.WEBHOOK_ENDPOINT;
  const passcode = getFlag("passcode") || process.env.WEBHOOK_PASSCODE;
  if (!endpoint || !passcode) {
    console.error("❌ --endpoint <Worker URL> 와 --passcode <비밀> 이 필요합니다.");
    process.exit(1);
  }
  // 중복 방지: 같은 endpoint 가 이미 있으면 새로 안 만든다.
  const existing = (await list()).find((h) => h.endpoint === endpoint);
  if (existing) {
    console.log(`\nℹ️ 이미 같은 endpoint 의 웹훅(id=${existing.id})이 있어 생성 생략.`);
    return;
  }
  const { ok, status, json } = await api("POST", API, {
    event_type: "FILE_UPDATE",
    context: "file",
    context_id: FILE_KEY,
    endpoint,
    passcode,
    description: "BO UI Kit → figma-to-react 자동 sync 트리거",
  });
  if (!ok) {
    console.error(`❌ create 실패 HTTP ${status}:`, json);
    process.exit(1);
  }
  console.log(`✅ 웹훅 생성됨 id=${json.id} status=${json.status}`);
  console.log("   (Figma 가 endpoint 로 PING 을 보내 200 을 받으면 ACTIVE 가 됩니다. `list` 로 확인하세요.)");
}

async function del() {
  const id = argv[1];
  if (!id) {
    console.error("❌ 사용법: node scripts/register-figma-webhook.mjs delete <webhook_id>");
    process.exit(1);
  }
  const { ok, status, json } = await api("DELETE", `${API}/${id}`);
  if (!ok) {
    console.error(`❌ delete 실패 HTTP ${status}:`, json);
    process.exit(1);
  }
  console.log(`🗑️ 웹훅 ${id} 삭제됨.`);
}

switch (cmd) {
  case "list":
    await list();
    break;
  case "create":
    await create();
    break;
  case "delete":
    await del();
    break;
  default:
    console.log("사용법: node scripts/register-figma-webhook.mjs <list|create|delete>");
    console.log("  create --endpoint <Worker URL> --passcode <비밀>");
    console.log("  delete <webhook_id>");
    process.exit(cmd ? 1 : 0);
}
