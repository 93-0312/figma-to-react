# Figma → React Design-to-Code 동기화 파이프라인 (프로젝트 기록)

> 내부 레퍼런스용 문서. Figma "BO UI Kit"을 React 컴포넌트로 추출하고, 변경을 자동 감지·동기화하는 파이프라인의 전체 구성과 운영 방법을 기록한다.

---

## 1. 개요

- **목적**: Figma 디자인(BO UI Kit)을 React/Tailwind 컴포넌트로 추출하고, Figma 변경을 자동 감지 → 헤드리스 동기화 → PR 까지 잇는다.
- **한 줄 요약**: *디자인 변경 → 크론 감지 → GitHub Issue 알림 → 헤드리스 Claude 추출 → 자동 PR → 사람 리뷰·머지.*
- **저장소**: `https://github.com/93-0312/figma-to-react` (public)
- **Figma 파일**: BO UI Kit, fileKey `LFA5EyNbUdPvi8Rbuf2tJC` (Figma 팀 "plan's team", Pro)

## 2. 기술 스택

Vite + React 18 + TypeScript + Tailwind v3 + class-variance-authority(cva) + tailwind-merge.
컴포넌트는 `src/components/ui/`, 토큰은 `src/index.css`(CSS 변수) + `tailwind.config.js`.

## 3. 아키텍처

```
Figma (BO UI Kit, fileKey)
   │ 버전 변경 (오토세이브 포함)
   ▼
[감지] GitHub Actions cron (figma-poll.yml, REST /versions)
   │ 현재 version ≠ manifest.lastSyncedVersion
   ▼
[알림] GitHub Issue 자동 생성 (열린 이슈 1개 = 디바운스)
   │
   ▼
[추출] 헤드리스 Claude (figma-sync.yml, claude-code-action)
   │ 원격 MCP(fileKey) 또는 REST 로 토큰·구조 추출 → 코드와 diff
   ▼
[기록] 검증(tsc+build) → figma-sync/* 브랜치 → PR (closes #issue)
   ▼
[종료] 머지 → Issue 자동 종료 → baseline 갱신 → 다음 사이클
```

**감지(클라우드/REST) ↔ 추출(에이전트/MCP) 분리**가 핵심. 감지는 Figma 안 켜도 서버에서 fileKey 로 동작, 추출은 헤드리스 Claude 가 수행.

## 4. 추출된 컴포넌트

| 컴포넌트 | 파일 | Figma node | 비고 |
|---|---|---|---|
| Button | `src/components/ui/button.tsx` | 1692:74 | 7 variant × 5 size, icon 슬롯 |
| Checkbox | `src/components/ui/checkbox.tsx` | 5667:129 | 박스 전용(.Selector). checked/indeterminate/disabled/mobile |
| Input | `src/components/ui/input.tsx` | 7745:699 | 슬롯형. sm/md/lg + invalid/disabled/focus + icon·prefix/suffix |
| Label | `src/components/ui/label.tsx` | 7658:2157 | 접근성 label |
| Field | `src/components/ui/field.tsx` | 7745:713 | 폼 래퍼(label + control + 보조영역) |

- 미니 플레이그라운드: `src/playground/` + `src/stories/*.story.tsx` (자체 구현, 실제 Storybook 패키지 아님)
- 매니페스트(추출 대상 단일 소스): `figma.manifest.json`

## 5. 자동 동기화 파이프라인 구성요소

| 파일 | 역할 |
|---|---|
| `figma.manifest.json` | 노드↔파일 매핑 + `lastSyncedVersion`(baseline) |
| `scripts/check-figma-version.mjs` (`npm run check:figma`) | REST `/versions` 로 변경 감지. exit 0=최신/10=변경/2=오류 |
| `.github/workflows/figma-poll.yml` | cron(15분) + 수동. 변경 시 Issue 생성(중복 방지) |
| `.github/workflows/figma-sync.yml` | 헤드리스 Claude(claude-code-action) 추출→검증→PR. PR 자동생성 폴백 스텝 포함 |
| `AX_LAB/.claude/commands/sync-figma.md` | 대화형 `/sync-figma` 명령(원격 MCP 우선 추출) |
| `CLAUDE.md` | 프로젝트 규칙(특히 ★ Variant 매핑 규칙) |
| `SYNC_PLAN.md`, `LEVEL2_SETUP.md` | 계획·셋업 가이드 |

## 6. 시크릿 / 계정

| 항목 | 값/위치 | 비고 |
|---|---|---|
| `FIGMA_TOKEN` | 저장소 Actions Secret + 로컬 `.env`(gitignore) | Figma PAT. 변경 감지/REST 용 |
| `CLAUDE_CODE_OAUTH_TOKEN` | 저장소 Actions Secret | `claude setup-token`(Max/Pro 구독)으로 발급. 헤드리스 Claude 인증 |
| GitHub 계정 | `93-0312` | gh CLI 인증 |
| **Figma seat** | **it@eromnet.com = Dev seat** (plan's team) | 원격 MCP 200/일. dlwogus432@gmail.com=View(6/월)이라 사용 금지 |
| Actions PR 권한 | "Allow GitHub Actions to create and approve pull requests" = **ON** | 안 켜면 GITHUB_TOKEN PR 생성 실패 |

## 7. 운영 가이드

### 변경 감지 (수동 확인)
```
npm run check:figma   # exit 10=변경, 0=최신
```

### 동기화 (대화형)
1. (원격 MCP 사용 시) Figma MCP 가 **it@eromnet.com(Dev seat)** 으로 인증돼 있어야 함
2. `/sync-figma` 실행 → 원격 MCP(fileKey)로 추출 → 코드 diff → 검증 → 브랜치 → PR

### 동기화 (헤드리스/CI)
```
gh workflow run "Figma sync (headless Claude)"
```
→ 변경 있으면 추출→검증→PR 자동 생성. (CI 는 원격 MCP 인증 없음 → REST 로 추출)

### 변경 감지 자동 실행
- `figma-poll.yml` cron(15분, best-effort) — 변경 시 Issue 자동 생성
- 정밀 주기가 필요하면 webhook(Cloudflare Worker) 검토 (Figma 웹훅 = 유료 플랜)

## 8. 비용

| 항목 | 비용 |
|---|---|
| 감지(figma-poll, REST) | $0 (Claude 미사용) |
| 헤드리스 sync 1회(실제 추출, Sonnet) | ~$1.1~1.4 상당 |
| GitHub Actions 분 | $0 (public 저장소 무료) |
| 원격 MCP 호출 | $0 (Dev seat 쿼터 200/일 중 소비) |

- 인증: ~2026-06-15 전엔 **공유 구독 한도**(5h 롤링+주간), 이후 헤드리스는 **Agent SDK 별도 월간 크레딧**(Pro $20 / Max5 $100 / Max20 $200, 빌링주기 리셋, 이월X).

## 9. 알려진 제약 / 함정

1. **GitHub schedule = best-effort**: cron 이 정확히 N분마다 안 돈다(초기 지연 + 누락, 실측 2~3.5h 간격). 정밀 주기엔 외부 스케줄러/webhook 필요.
2. **Figma MCP seat 한도**: View seat = **6회/월**, Dev/Full = 200~600/일. 인증 계정의 seat 종류가 곧 쿼터.
3. **원격 MCP vs 앱 커넥터 vs CLI MCP**: figma MCP 는 `plugin:figma:figma`(mcp.figma.com). `claude mcp add` 로 중복 항목 만들면 충돌. 계정 변경 시 `mcp__plugin_figma_figma__authenticate` → 올바른 계정으로 브라우저 승인 → `complete_authentication(callback_url)`. 앱 재시작 필요할 수 있음.
4. **Actions PR 권한**: 저장소 설정 "Allow GitHub Actions to create and approve pull requests" 가 OFF 면 PR 자동생성 실패.
5. **헤드리스 OIDC**: claude-code-action 은 `permissions: id-token: write` 필요.
6. **Figma 변수 REST API**: Enterprise 전용. Pro 는 노드 fill 해석으로 우회.

## 10. ★ 핵심 규칙 (CLAUDE.md)

- **Variant 속성 1:1 매핑**(평탄화 금지), **2^N 조합 전체+엣지 확인**, 게이팅/우선순위는 Figma 조건식이 진실의 원천, 진리표 JSDoc 주석.
- 토큰 하드코딩 금지(전부 CSS 변수/Tailwind 토큰).
- 동기화는 **값 + 바인딩** 2축 검증. **모든 매니페스트 컴포넌트 재추출**(한 노드만 보면 다른 변경 놓침).
- main 직접 push 금지, 항상 브랜치 + PR(사람 리뷰 게이트).

## 11. 다음 단계 / 백로그

- webhook(Cloudflare Worker, 무료) → "게시 즉시" 트리거 (Figma 웹훅 유료 플랜 필요)
- "게시된 버전(Components published)만 감지" 필터로 노이즈/비용↓
- Input 특수 변형(인라인 Button/Badge/Kbd/MultiSelect/File/InnerLabel/Fill) 추가
- 컴포넌트 확장: Textarea, Select, Switch, Radio, Card, Dialog …
- 다크모드 토큰 정밀화(현재 근사값)

---

*최종 갱신: 2026-06-11. 작성: design-to-code 동기화 파이프라인 작업 세션 기록.*
