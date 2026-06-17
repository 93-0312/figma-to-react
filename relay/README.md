# Figma 웹훅 중계자 (Cloudflare Worker)

Figma 파일 저장 → **자동 sync**의 시작점.
Figma 웹훅(`FILE_UPDATE`)을 받아 GitHub `repository_dispatch(figma-changed)`로 넘기면,
[`figma-poll`](../.github/workflows/figma-poll.yml)의 노드 핑거프린트 게이트가 진짜 변경일 때만 sync→PR을 돌린다.

```
Figma 저장 ──webhook──▶ [이 Worker] ──repository_dispatch──▶ figma-poll(게이트) ──▶ figma-sync ──▶ PR
                         passcode + file_key 검증
```

## 사전 준비물

| | 무엇 | 어디서 |
|---|---|---|
| GitHub PAT | `repo` 스코프 (dispatch 호출용) | github.com → Settings → Developer settings → Tokens |
| passcode | 아무 랜덤 문자열 (Worker ↔ 등록 스크립트 공유 비밀) | 직접 생성 (예: `openssl rand -hex 16`) |
| Figma 토큰 | 웹훅 권한 보유 (이미 `.env`의 `FIGMA_TOKEN` 확인됨) | — |

## 배포 (이 디렉터리에서)

```bash
npm i -g wrangler           # 또는 npx wrangler ...
wrangler login              # 브라우저로 Cloudflare 인증

# 비밀 2개 저장 (Cloudflare 에만, 깃에는 안 들어감)
wrangler secret put GITHUB_TOKEN      # ← repo 스코프 PAT 붙여넣기
wrangler secret put FIGMA_PASSCODE    # ← 위에서 만든 passcode

wrangler deploy             # → https://figma-webhook-relay.<계정>.workers.dev 출력됨
```

`wrangler.toml`의 `[vars]`(레포/파일키/이벤트명)는 비밀이 아니라 커밋돼 있다.

## Figma 웹훅 등록 (레포 루트에서, 1회)

```bash
node scripts/register-figma-webhook.mjs create \
  --endpoint https://figma-webhook-relay.<계정>.workers.dev \
  --passcode <위와 동일한 passcode>

node scripts/register-figma-webhook.mjs list     # status=ACTIVE 확인
```

등록 직후 Figma가 endpoint로 `PING`을 보내고, Worker가 200을 돌려주면 `ACTIVE`가 된다.

## 동작 확인

1. Figma에서 "BO UI Kit" 파일을 저장(아무 변경).
2. `FILE_UPDATE`는 Figma가 **디바운스**(파일당 대략 ~30분에 한 번)해 보내므로 즉시가 아닐 수 있음.
3. GitHub → Actions → **Figma poll** 실행이 `repository_dispatch`로 뜨는지 확인.
4. 실제 컴포넌트 변경이면 → Figma sync → PR 까지 자동.

## 운영 메모

- **검증 2단**: ① passcode(요청 본문) ② file_key(우리 파일만). 둘 다 통과해야 dispatch.
- **노이즈 필터는 그대로**: 웹훅은 "신호"일 뿐, 진짜 변경 판단은 poll의 해시 게이트가 한다 → autosave로 헛돌지 않음.
- **PAT 만료 시**: dispatch가 502로 실패 → `wrangler secret put GITHUB_TOKEN`으로 갱신.
- **웹훅 삭제**: `node scripts/register-figma-webhook.mjs delete <id>`.
- 팀/회사용으로 굳힐 땐 PAT 대신 **GitHub App 토큰**, Figma 토큰은 **서비스 계정**으로 옮기는 것을 권장.
