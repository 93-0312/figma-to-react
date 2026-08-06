# Figma → React Design-to-Code 파이프라인 (프로젝트 기록)

> 내부 레퍼런스. Figma "BO UI Kit"을 React 컴포넌트로 추출하고, 변경을 **완전 무인으로** 감지 → 동기화 → 검증 → 배포 가능 상태로 만드는 파이프라인의 구성·운영을 기록한다.

---

## 1. 개요

- **목적**: Figma(BO UI Kit) → React/Tailwind 컴포넌트 추출 + 디자인 변경 자동 동기화 + npm 라이브러리 배포.
- **한 줄 요약**: *Figma **발행(publish)** → 노드 단위 감지 → 헤드리스 Claude 추출 → 시각 증거 PR → 재검증 green 시 **자동 머지** → 이슈 자동 종료.*
  (머지가 자동인 경우/사람 몫인 경우 구분은 [PR 머지 정책](./pr-merge-policy.md) 참고)
- **저장소**: `https://github.com/93-0312/figma-to-react` (public)
- **Figma 파일**: BO UI Kit, fileKey `LFA5EyNbUdPvi8Rbuf2tJC` (팀 "plan's team", Pro)
- **npm 패키지**: `bo-ui-kit` (0.1.0, 발행 직전)

## 2. 기술 스택

Vite + React 18 + TypeScript + Tailwind v3 + class-variance-authority(cva) + tailwind-merge.
컴포넌트 `src/components/ui/`, **토큰 단일 소스 `src/tokens.css`**(앱 `index.css`와 라이브러리 빌드가 공유) + `tailwind.config.js`.

## 3. 아키텍처 (완전 무인 루프)

```
Figma (BO UI Kit, fileKey)
   │ 디자인 변경 (오토세이브 포함)
   ▼
[감지 1차] figma-poll.yml cron — REST /versions 로 파일 버전 변화
   │ 버전이 바뀜
   ▼
[감지 2차] check-figma-nodes — 추적 노드의 실제 내용 해시(figma.fingerprints.json) 비교
   │ autosave/무관 변경 → 워터마크만 전진하고 종료(헤드리스 미실행)
   │ 실제 컴포넌트 변경 → 계속
   ▼
[알림+트리거] Issue 생성 + figma-sync 자동 dispatch (변경당 1회)
   ▼
[추출] figma-sync.yml — 헤드리스 Claude(claude-code-action)가 변경분만 추출 → 검증(tsc+build) → figma-sync/* 브랜치 → PR(Closes #이슈)
   ▼
[검증] visual.yml — 시각 회귀 gate + Figma/Before/After/Diff 증거 코멘트 + baseline·지문 자동 갱신
        smoke.yml — 소비자(consumer/pack-consumer) 설치·렌더·exports 검증
   ▼
[종료] 사람이 증거 보고 머지 → 이슈 자동 종료 → 다음 사이클
```

**핵심 설계**: ① 감지(클라우드/REST, $0)와 추출(헤드리스 에이전트)을 분리. ② **노드 지문**으로 autosave 노이즈를 걸러 헤드리스 비용 0 유지. ③ 사람의 유일한 수동 단계는 **PR 머지**.

## 4. 추출된 컴포넌트 (10종)

| 컴포넌트 | 파일 | Figma node | 비고 |
|---|---|---|---|
| Button | `button.tsx` | 1692:74 | 7 variant × 5 size, icon 슬롯 |
| Checkbox | `checkbox.tsx` | 5667:129 | .Selector 박스. IsSelected 마스터 게이트 |
| Input | `input.tsx` | 7745:699 | 슬롯형. sm/md/lg + invalid/disabled/focus |
| Label | `label.tsx` | 7658:2157 | 접근성 label |
| Field | `field.tsx` | 7745:713 | 폼 래퍼(label+control+보조영역) |
| Input OTP | `input-otp.tsx` | 8060:1580 | 슬롯형 OTP(6자리 3-3), isLarge |
| Meter | `meter.tsx` | 7664:31 | role=meter + aria-value*, value/min/max |
| Toggle | `toggle.tsx` | 5685:204 | 2-state 버튼, pressed/hover/disabled |
| Toggle Group | `toggle-group.tsx` | 5686:270 | 세그먼티드, single/multiple |
| Select | `select.tsx` | 7751:1561 | 드롭다운, popover 패널 |

- 플레이그라운드: `src/playground/` + `src/stories/*.story.tsx`(자체 구현, 실제 Storybook 아님)
- 추출 대상 단일 소스: `figma.manifest.json` · 노드 지문: `figma.fingerprints.json`

## 5. 파이프라인 구성요소

| 파일 | 역할 |
|---|---|
| `figma.manifest.json` | 노드↔파일 매핑 + `lastSyncedVersion`(워터마크) |
| `figma.fingerprints.json` | 추적 노드의 내용 해시(2차 감지 기준점) |
| `scripts/check-figma-version.mjs` | REST `/versions` 1차 감지(가벼움). exit 0/10/2 |
| `scripts/check-figma-nodes.mjs` | `/nodes` 노드 해시 2차 감지(버전 변화 시 1회). exit 0/10/2 |
| `scripts/build-lib.mjs` | 라이브러리 빌드(vite lib + tsc + tailwind CLI) |
| `scripts/pr-evidence.mjs` | PR 시각 증거(Figma + Before/After/Diff) 수집 |
| `scripts/pack-test.mjs` | tarball 만들어 pack-consumer에 설치(배포물 검증) |
| `.github/workflows/figma-poll.yml` | cron 감지(KST 04~24시) → 실제 변경 시 Issue + sync 트리거 |
| `.github/workflows/figma-sync.yml` | 헤드리스 Claude 추출 → 검증 → PR(Closes #N) + visual dispatch |
| `.github/workflows/visual.yml` | 시각 회귀 + 증거 코멘트 + sync PR baseline·지문 자동 갱신 |
| `.github/workflows/smoke.yml` | 소비자 설치·렌더 + tarball·CJS 검증 |
| `.github/workflows/token-health.yml` | FIGMA_TOKEN 매일 점검(만료 시 Issue, 복구 시 자동 종료) |
| `CLAUDE.md` | 프로젝트 규칙(★ Variant 매핑) |

## 6. 시각 회귀 (visual.yml)

- Playwright `toHaveScreenshot`로 플레이그라운드 컴포넌트를 스냅샷 비교. **CI(Linux) 전용** baseline(`tests/**-snapshots/*-linux.png`), 로컬은 `ignoreSnapshots`로 비교 생략.
- `maxDiffPixels: 100` + **`threshold: 0.03`** — 등명도 색상(파랑↔보라)·옅은 회색 변경까지 잡도록 민감하게(pixelmatch가 밝기 위주라 기본값은 놓침).
- sync PR(`figma-sync/*`)은 증거를 남긴 뒤 **baseline + 노드 지문을 자동 갱신**해 PR에 커밋 → 머지 시 원자적 반영(수동 dispatch 불필요).
- **PR 시각 증거**: 변경 컴포넌트의 Figma 원본 + Before/After/Diff PNG를 orphan 브랜치에 올려 PR 코멘트로 인라인 첨부.

## 7. npm 라이브러리

- 빌드(`npm run build:lib`, `prepack` 자동): vite lib → `dist/index.js`(ESM) + `dist/index.cjs`(CJS), tsc → `*.d.ts`, tailwind CLI → `dist/styles.css`(토큰 + 컴포넌트 유틸, preflight off).
- `package.json`: `exports`(import/require/types/styles.css), `files:["dist"]`, peer react, deps cva/clsx/tailwind-merge, `publishConfig.access:public`.
- 토큰 단일 소스 `src/tokens.css` → 앱·라이브러리 드리프트 방지.
- 소비자 검증: `examples/consumer`(워크스페이스 링크, 브라우저 렌더) + `examples/pack-consumer`(tarball만, files 경계·exports·ESM/CJS).
- 발행: unscoped 공개 패키지(`bo-ui-kit`). `npm login` 후 `npm publish`(공개가 기본). 라이선스 **MIT**(오픈소스). 비공개로 바꾸려면 GitHub Packages/유료 private.

## 8. 시크릿 / 계정

| 항목 | 값/위치 | 비고 |
|---|---|---|
| `FIGMA_TOKEN` | Actions Secret + 로컬 `.env` | Figma PAT(it@eromnet.com Dev seat). 만료일은 API로 안 보임 → token-health가 점검 |
| `CLAUDE_CODE_OAUTH_TOKEN` | Actions Secret | `claude setup-token`(Max 구독). 만료 시 sync 실패 → 알림 |
| `GITHUB_TOKEN` | 자동(워크플로 per-run) | 무관리 |
| GitHub 계정 | `93-0312` | |
| Actions 권한 | "Allow GitHub Actions to create and approve PRs" = **ON** + 워크플로 권한에 `actions:write` | poll→sync dispatch, sync→visual dispatch에 필요 |

## 9. 운영 가이드

```bash
npm run check:figma                          # 변경 감지(수동)
gh workflow run "Figma sync (headless Claude)"  # 헤드리스 동기화 수동 실행
gh workflow run "Visual regression" -f update_baselines=true   # Linux baseline 재시드
gh workflow run "Token health"               # 토큰 점검 수동
```

- 폴링: `figma-poll.yml` cron `7,22,37,52 0-14,19-23 * * *`(UTC) = **KST 00~04시 정지**, 그 외 ~15분.
- 자동 흐름: 실제 컴포넌트 변경 → 이슈 + sync 자동 → PR(증거+baseline) → **사람은 머지만**.

### 로컬 개발 명령

| 명령 | 설명 |
|---|---|
| `npm run dev` | 플레이그라운드(컴포넌트 카탈로그) |
| `npm run verify` | 타입체크 + 빌드 |
| `npm run build:lib` | 라이브러리 빌드 → `dist/`(ESM+CJS+타입+styles.css) |
| `npm run test:visual` | 시각 회귀(로컬은 비교 생략, CI=Linux 기준) |
| `npm run check:figma` | Figma 변경 감지(exit 10=변경) |
| `npm run pack:test` | tarball 만들어 `examples/pack-consumer`에 설치(배포물 검증) |

소비자 검증 예시: `examples/consumer`(워크스페이스 링크) · `examples/pack-consumer`(tarball 전용).

### 프로젝트 구조

```
src/
  components/ui/   컴포넌트 (배럴: index.ts)
  stories/         플레이그라운드 스토리
  tokens.css       디자인 토큰(단일 소스 — 앱·라이브러리 공유)
  index.css        앱 진입 CSS (tokens 임포트)
lib/styles.css     라이브러리 CSS 입력(프리빌드용)
scripts/           감지/빌드/검증 스크립트
.github/workflows/ figma-poll · figma-sync · visual · smoke · token-health
examples/          consumer(링크) · pack-consumer(tarball)
figma.manifest.json / figma.fingerprints.json   추출 대상 + 노드 지문
CLAUDE.md          컴포넌트 작성 규칙(★ Variant 매핑)
README.md          라이브러리 사용자용 (설치·사용·컴포넌트)
docs/CONFLUENCE.md 이 문서 — 내부 파이프라인/운영 레퍼런스
```

> **문서 분담**: 라이브러리 **사용자**용 안내는 `README.md`(npm 게시), **내부 개발/파이프라인/운영**은 이 Confluence 문서.

## 10. 알려진 제약 / 함정 (실전 학습)

1. **GITHUB_TOKEN으로 만든 PR/푸시는 워크플로를 트리거 안 함**(재귀 방지). 단 `workflow_dispatch`/`repository_dispatch`는 예외 → poll→sync, sync→visual은 dispatch로 연결.
2. **claude-code-action은 봇 시작 워크플로를 차단** → `allowed_bots: "github-actions"` 필요(poll이 봇으로 sync 트리거).
3. **pixelmatch는 밝기(Y) 위주** → 등명도 색상 변경을 기본 threshold(0.2)가 놓침. 0.03으로 낮춤.
4. **시각 baseline은 OS별**(win32≠linux) → CI(Linux)만 진실의 원천, 로컬은 비교 생략.
5. **autosave가 파일 버전을 올림** → 노드 지문 2차 게이트로 걸러야 헤드리스 헛돈 실행·좀비 이슈 방지.
6. **GitHub schedule = best-effort**(지연·누락). 정밀 주기엔 외부 스케줄러/webhook.
7. **Figma seat 한도**: View=6/월, Dev=200/일. 인증 계정 seat이 곧 쿼터. 변수 REST API는 Enterprise 전용(Pro는 노드 fill 해석).
8. **헤드리스 OIDC**: `permissions: id-token: write` 필요. 토큰 발행 PR엔 LICENSE 필드 누락(발행 전 보완).

## 11. ★ 핵심 규칙 (CLAUDE.md)

- **Variant 1:1 매핑**(평탄화 금지), 2^N 조합+엣지 확인, 게이팅은 Figma 조건식이 진실, 진리표 JSDoc.
- 토큰 하드코딩 금지(전부 CSS 변수/Tailwind 토큰), 새 토큰은 `tokens.css`+`tailwind.config.js` 양쪽.
- 동기화는 **값 + 바인딩** 2축 검증(토큰 값 같아도 참조 바뀐 경우 잡기), Figma에 없는 토큰 발명 금지.
- main 직접 push 금지, 항상 브랜치+PR.

## 12. 최신 변경 내역 (changelog)

- **2026-06-16**
  - 컴포넌트 추가: Input OTP, Meter, Toggle, Toggle Group, Select (총 10종).
  - **npm 라이브러리화**: ESM+CJS dual 빌드, 프리빌드 CSS(Tailwind 불필요), 타입, 토큰 단일 소스(`tokens.css`). `bo-ui-kit`.
  - **소비자 스모크 CI**(`smoke.yml`): `examples/consumer`(브라우저 렌더) + `examples/pack-consumer`(tarball 전용, files 경계·exports·ESM/CJS).
  - **노드 단위 감지**(`check-figma-nodes` + `figma.fingerprints.json`): autosave 헛돈 sync·좀비 이슈 제거.
  - **완전 무인화**: poll이 실제 변경 시 sync를 자동 트리거(`allowed_bots`), 이슈 `Closes #N` 자동 종료, 폴링 새벽(KST 00~04) 정지.
  - **시각 회귀 정밀화**: threshold 0.1→0.03(등명도/회색 변경 감지), sync PR baseline+지문 자동 갱신, win32 baseline 제거(CI Linux 단일화).
  - **토큰 헬스체크**(`token-health.yml`) + sync 실패 알림.
- **2026-06-11**: 초기 파이프라인(폴링 감지 → Issue → 헤드리스 추출 → PR), 컴포넌트 5종(Button/Checkbox/Input/Label/Field), 시각 회귀 도입.

---

*최종 갱신: 2026-06-16. 작성: design-to-code 파이프라인 작업 세션 기록.*
