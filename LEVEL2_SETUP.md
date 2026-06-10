# 레벨 2 — 헤드리스 Claude 자동 동기화 셋업

`.github/workflows/figma-sync.yml` 이 트리거되면 **헤드리스 Claude**가 Figma 변경을 추출해 **자동 PR**을 만든다.
이걸 켜려면 아래 사용자 단계가 필요하다.

## 사용자 액션 (1회)

### 1. Claude 구독 토큰 발급 (헤드리스 인증)
로컬 터미널에서:
```
claude setup-token
```
- 브라우저 인증 후 `sk-ant-oat01-...` 형태의 **장기 토큰**이 나온다 (Max/Pro 구독 필요 — 보유함).
- 이 값을 복사.

### 2. 저장소 Secret 등록
```
gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo 93-0312/figma-to-react
# (프롬프트에 토큰 붙여넣기)
```
- `FIGMA_TOKEN` 은 이미 등록돼 있음.

### 3. (권장) Claude GitHub App 설치
- https://github.com/apps/claude 를 저장소에 설치하면 PR 생성/권한이 매끄럽다.
  (GITHUB_TOKEN 만으로도 대체로 동작하지만, 앱이 있으면 안정적.)

### 4. 테스트 실행
```
gh workflow run "Figma sync (headless Claude)" --repo 93-0312/figma-to-react
```
- Actions 탭에서 실행 로그 확인 → 변경이 있으면 PR 생성됨.

## ⚠️ 첫 실행으로 검증할 것 (미확정 변수)
- **CI 에서 Figma 추출이 되는가** — 두 경로 중 하나:
  - (a) 원격 Figma MCP 가 CI 헤드리스에서 인증되는지,
  - (b) 안 되면 REST 로 폴백(단 변수 값은 Enterprise REST 필요 → Pro 는 노드 fill 해석으로 우회).
- 첫 실행 로그를 보고 어느 경로가 되는지 확인 후, 프롬프트/설정을 다듬는다.

## 트리거 방식
- **수동**: `gh workflow run` 또는 Actions 탭 "Run workflow".
- **외부(향후)**: `repository_dispatch` (type: `figma-changed`). Figma 웹훅 → Cloudflare Worker → 이 dispatch 호출 → 자동 실행.

## 비용
- Actions 분: **공개 저장소라 무료**.
- Claude 사용량: **Max-5 구독 사용량 소비** (여유 넉넉). 별도 API 과금 없음.

## 안전
- main 직접 push 금지 — 항상 `figma-sync/*` 브랜치 + PR (사람 리뷰 게이트).
- 생성물은 틀릴 수 있으므로 **PR 리뷰 후 머지** 권장.
