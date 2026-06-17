# bo-ui-kit

Figma **"BO UI Kit"** 디자인 시스템을 React 컴포넌트로 만들고, **디자인 변경을 자동으로 코드에 동기화**하는 프로젝트.

`React 18 · TypeScript · Tailwind v3 · cva` · 컴포넌트 10종 · npm 라이브러리(ESM+CJS) · 5종 CI 게이트

---

## 이 저장소가 하는 일 (3가지)

| | 무엇 | 핵심 |
|---|---|---|
| 1. **컴포넌트 라이브러리** | `bo-ui-kit` — 설치해서 쓰는 React UI | ESM+CJS, Tailwind 없이도 동작(프리빌드 CSS), 타입 포함 |
| 2. **자동 동기화 파이프라인** | Figma 변경 → 감지 → 추출 → PR | 헤드리스 Claude가 변경분만 추출, 사람은 머지만 |
| 3. **품질 게이트(CI)** | 시각 회귀 + 소비자 스모크 | 컴포넌트/배포물이 깨지면 PR에서 빨강 |

> 한 줄 요약: **디자이너가 Figma를 바꾸면 → 코드 PR이 알아서 생기고(증거 스크린샷 첨부) → 라이브러리로 배포 가능**.

---

## 빠른 시작 — 라이브러리로 쓰기

```bash
npm i bo-ui-kit        # peer: react, react-dom >=18
```

```tsx
import { Button, Meter, Field, Input } from "bo-ui-kit";
import "bo-ui-kit/styles.css";   // 토큰+유틸 한 줄 (앱 진입점에서 1회)

export default function App() {
  return (
    <Field label="이메일" required>
      <Input placeholder="you@example.com" />
    </Field>
  );
}
```

- **ESM·CommonJS 모두 지원** (`import` / `require` 둘 다)
- **Tailwind 불필요** — `styles.css` 한 줄이면 토큰·유틸 전부 포함
- **다크 모드** — 상위 요소에 `class="dark"`
- **테마 변경** — `styles.css`의 CSS 변수(`--primary` 등)를 덮어쓰기
- **폰트** — Pretendard 우선, 없으면 시스템 산세리프 폴백

---

## 컴포넌트 (10종)

| 컴포넌트 | export | Figma node |
|---|---|---|
| Button | `Button` | 1692:74 |
| Checkbox | `Checkbox` | 5667:129 |
| Input | `Input` | 7745:699 |
| Label | `Label` | 7658:2157 |
| Field | `Field` | 7745:713 |
| Input OTP | `InputOTP` `InputOTPSlot` `InputOTPSeparator` | 8060:1580 |
| Meter | `Meter` | 7664:31 |
| Toggle | `Toggle` | 5685:204 |
| Toggle Group | `ToggleGroup` `ToggleGroupItem` | 5686:270 |
| Select | `Select` | 7751:1561 |

미리보기(자체 플레이그라운드): `npm run dev` → 좌측 컴포넌트 목록.
추출 대상 단일 소스: `figma.manifest.json`.

---

## 자동 동기화 파이프라인

```
Figma (BO UI Kit)
  │ 디자인 변경
  ▼
① 감지   figma-poll.yml (cron)  — 파일 버전 + 추적 노드 지문 비교
  │ 실제 컴포넌트가 바뀐 경우에만
  ▼
② 추출   figma-sync.yml — 헤드리스 Claude가 변경분만 추출 → 검증(tsc+build) → PR
  │ (PR에 "Closes #이슈" 연결)
  ▼
③ 검증   visual.yml — 시각 회귀 + Figma/Before/After/Diff 증거 코멘트
  │        smoke.yml — 소비자 설치·렌더 + tarball 검증
  ▼
④ 사람   PR 증거 보고 머지 → 이슈 자동 종료 → baseline 자동 갱신
```

- **autosave는 무시**: 버전만 올라가고 추적 노드(컴포넌트)가 안 바뀌면 헤드리스를 돌리지 않음(`figma.fingerprints.json` 지문 비교).
- **PR 시각 증거**: 변경된 컴포넌트의 Figma 원본 + 렌더 Before/After/Diff를 PR 코멘트로 자동 첨부.
- **토큰 점검**: `token-health.yml`이 `FIGMA_TOKEN` 만료를 매일 점검(만료 시 Issue).

> 파이프라인 구성·운영·시크릿·함정 상세는 **[docs/CONFLUENCE.md](docs/CONFLUENCE.md)**.

---

## 개발

| 명령 | 설명 |
|---|---|
| `npm run dev` | 플레이그라운드(컴포넌트 카탈로그) |
| `npm run verify` | 타입체크 + 빌드 |
| `npm run build:lib` | 라이브러리 빌드 → `dist/`(ESM+CJS+타입+styles.css) |
| `npm run test:visual` | 시각 회귀(로컬은 비교 생략, CI=Linux 기준) |
| `npm run check:figma` | Figma 변경 감지(exit 10=변경) |
| `npm run pack:test` | tarball 만들어 `examples/pack-consumer`에 설치(배포물 검증) |

소비자 검증 예시: `examples/consumer`(워크스페이스 링크) · `examples/pack-consumer`(tarball 전용).

---

## 프로젝트 구조

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
docs/CONFLUENCE.md 파이프라인/운영 레퍼런스
```
