# Figma → React 자동 동기화 계획 (SYNC_PLAN)

Figma 파일이 변경되면 컴포넌트를 자동 추출·업데이트하고 커밋·푸시(PR)까지 하는 파이프라인 계획.

## 확정된 방향 (결정 완료)

- **추출 엔진**: 하이브리드 — 토큰은 결정적 스크립트, 컴포넌트(variant/로직)는 에이전트.
- **반영 방식**: `figma-sync/<version>` 브랜치 → 커밋·푸시 → **PR 생성**(사람 리뷰 게이팅). main 직푸시 금지.
- **실행 환경**: 단계적 — 로컬 MVP(Phase 0) 먼저, 이후 무인 CI(Phase 2)로 확장.

## ⚠️ 핵심 제약

- 현재 쓰는 `figma-local` MCP 는 **Figma 데스크톱이 열려 있고 활성 파일일 때만**, **에이전트만** 호출 가능.
  일반 스크립트/CI 단독 호출 불가.
- 진짜 무인 자동화는 **Figma REST API + webhook** 필요. 단, variables REST API 등은 상위 플랜(Enterprise) 제약 가능.
- 생성물은 **틀릴 수 있다**(예: Checkbox `IsSelected` 게이팅 버그). → 검증 게이트 + PR 리뷰가 안전판.

## 파이프라인 단계

| # | 단계 | 하는 일 | 난이도 | 메모 |
|---|---|---|---|---|
| 1 | 트리거/변경 감지 | Figma 변경 인지 | ★★★ | webhook(FILE_UPDATE) / REST 폴링(`version` 비교) / 스케줄 / 수동 |
| 2 | 디자인 상태 수집 | 노드·토큰·스크린샷 fetch | ★★ | 로컬 MCP(대화형) or REST API |
| 3 | 매핑 매니페스트 | "노드ID → 컴포넌트 파일" 단일 소스 | ★ | `figma.manifest.json` (현재 매핑은 메모리에만 존재) |
| 4 | Diff | 직전 스냅샷과 비교해 변경 컴포넌트만 추림 | ★★ | 마지막 동기화 `version` 저장, 전체 재생성 방지 |
| 5 | 추출/재생성 | 변경분을 컴포넌트로 변환 | ★★★ | 토큰=결정적, 컴포넌트=에이전트 |
| 6 | 검증 게이트 | `tsc`+`vite build`+lint+DOM/스타일 단언(+스크린샷 diff) | ★★ | 자동 푸시 전 필수 |
| 7 | 커밋 | 변경 단위 conventional commit, **Figma version 포함** | ★ | 예: `feat(ui): sync Button from figma@v123` |
| 8 | 브랜치+푸시+PR | `figma-sync/<version>` → 푸시 → PR | ★ | 리뷰 게이팅 |
| 9 | 알림/리뷰 | PR 리뷰(사람) 또는 체크 통과 시 자동 머지 | ★ | 자동 머지는 리스크 |

## 가로지르는 관심사

- 🔑 인증/시크릿: Figma 토큰, git push 자격증명(deploy key/PAT)
- 🗺️ 노드↔컴포넌트 매니페스트(4·5단계 전제)
- ♻️ 상태 저장: 마지막 동기화 version + 스냅샷(diff용)
- 🛡️ 리뷰 게이팅: 생성물 오류 안전판
- 💳 플랜 의존성: webhook·variables REST API

## 단계적 도입(Phase)

### Phase 0 — 로컬 MVP (자동 감지 제외, 흐름 완성)
0-1. `figma.manifest.json` 생성 — Button/Checkbox/Input/Field 의 `노드ID ↔ 파일` 매핑 + 마지막 동기화 version 슬롯
0-2. `/sync-figma` 명령(Claude 커맨드) 골격 — 매니페스트 순회 → 토큰 결정적 동기화 + 컴포넌트 에이전트 추출
0-3. 검증 게이트 스크립트 — `npm run verify`(tsc + build + 핵심 DOM 단언)
0-4. git 자동화 — `figma-sync/<version>` 브랜치 커밋·푸시 → PR 생성(`gh pr create`)

### Phase 1 — 반자동 (변경 감지 추가)  ← 진행 중
- ✅ 1-1. 감지 스크립트 `scripts/check-figma-version.mjs` + `npm run check:figma`
  - REST `GET /v1/files/:key?depth=1` 의 `version` 을 매니페스트 `lastSyncedVersion` 과 비교
  - 종료코드 0=최신 / 10=변경 / 2=오류. `--record` 로 동기화 후 version 기록
  - **플랜 무관**(모든 플랜에서 PAT 로 동작). 토큰: `.env` 의 `FIGMA_TOKEN`(.env.example 참고)
- ⬜ 1-2. 트리거: 변경 시 `/sync-figma` 자동 실행
  - 옵션 A: 스케줄 루틴(schedule 스킬/cron)이 주기적으로 `check:figma` → 변경이면 헤드리스 Claude 로 `/sync-figma`
  - 옵션 B: `/loop` 로 세션 폴링
  - 옵션 C: 수동 — `npm run check:figma` 확인 후 `/sync-figma`
- ⬜ 1-3. Diff(4)로 변경된 컴포넌트만 추림(현재는 노드 단위 재추출)

**남은 사용자 액션**: `figma.com → Settings → Security` 에서 PAT(File content: read) 발급 →
`figma-to-react/.env` 에 `FIGMA_TOKEN=...` 저장 → `npm run check:figma` 로 라이브 확인.

### Phase 2 — 무인 CI
2-1. Figma webhook(FILE_UPDATE) 수신 엔드포인트
2-2. 헤드리스 Claude Agent SDK 실행(REST API 기반 수집)
2-3. CI에서 검증 → PR 자동 생성/라벨링

## ⚠️ Figma REST 레이트 리밋 (실측, 2026-06-10)

- `GET /v1/files/:key` 는 **파일 크기 비례 비용 기반 리밋**. 대형 파일("BO UI Kit")은
  한두 번 호출로 예산 소진 → **429 시 `Retry-After`=320841초 ≈ 89시간(~3.7일)** 실측됨.
- **교훈**:
  - 무거운 `GET /v1/files/:key` **폴링 금지**. 대신 가벼운 `GET /v1/files/:key/versions` 사용.
  - 429 에 **자동 재시도(backoff) 하지 말 것** — 비용 폭주로 리밋을 더 키운다. Retry-After 만 알리고 종료.
  - 폴링 주기는 **분 단위 ❌ → 시간/일 단위**. 잦은 변경 감지가 필요하면 **webhook**(push, 폴링비용 0)으로.
- 회복: 리밋 창 대기 / (per-token 리밋이면) 새 토큰 발급 시도 / webhook 전환.

## 다음 결정 포인트

- Phase 0 부터 만들기 시작할지, 어느 0-x 부터 할지.
- 토큰 결정적 동기화 도구 선택(Style Dictionary vs 자체 스크립트).
- Figma 플랜 확인(webhook/variables API 가용성) — Phase 2 전 필요.
- 레이트 리밋 회복 방법 선택(대기 vs 새 토큰 vs webhook).
