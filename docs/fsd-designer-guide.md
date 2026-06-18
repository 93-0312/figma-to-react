# FSD × 디자이너 협업 가이드
> BO UI Kit 프로젝트 기준 | 작성일: 2026-06-17

**관련 문서**
- [FSD 협업 개요](./fsd-overview.md) — 디자인·UI팀 공통 개요
- [FSD 운영 가이드](./fsd-operations-guide.md) — Figma부터 구현까지 실무 가이드
- [FSD 주요 용어 사전](./fsd-glossary.md) — 공식 용어·금지 표현
- [Figma FSD 정리 가이드](./figma-fsd-restructure-guide.md) — BO UI Kit Figma 정리 작업

---

## 1. FSD(Feature-Sliced Design)란?

프론트엔드 코드를 **역할 단위로 나누는 구조 약속**이에요.  
핵심 규칙은 하나: **위 레이어는 아래 레이어만 참조할 수 있고, 역방향은 금지.**

```
app          ← 앱 전체 설정 / 글로벌 테마
pages        ← 화면 단위 (URL 1개 = 페이지 1개)
widgets      ← 독립적으로 동작하는 큰 섹션/블록
features     ← 사용자 행동 단위 (좋아요, 로그인 등)
entities     ← 비즈니스 핵심 개념 (User, Product 등)
shared       ← 어디서든 쓰이는 공통 요소 ← BO UI Kit이 여기
```

### 디자이너 ↔ FSD 레이어 대응

| FSD 레이어 | 디자이너 언어 | 예시 |
|-----------|------------|------|
| `app` | 전체 테마 · 글로벌 토큰 | 다크모드, 전체 폰트 |
| `pages` | 화면 · 스크린 · 뷰 | 홈 화면, 마이페이지 |
| `widgets` | 섹션 · 패널 · 블록 | 헤더, 댓글 섹션 |
| `features` | 기능 · 인터랙션 · 유저 플로우 | 장바구니 담기 |
| `entities` | 도메인 오브젝트 · 카드 · 아이템 | 상품 카드, 유저 카드 |
| `shared` | 디자인 시스템 · 컴포넌트 라이브러리 | Button, Input, Badge |

---

## 2. Shared 레이어 구성 (BO UI Kit 기준)

BO UI Kit 전체가 FSD의 `shared` 레이어로 들어가요.

### 폴더 구조

```
src/shared/
├── tokens/                 ← Figma Foundation 페이지 대응
│   ├── colors.css
│   ├── typography.css
│   ├── spacing.css
│   └── effects.css
├── components/
│   └── ui/                 ← Figma BO UI Kit 컴포넌트 대응
│       ├── button.tsx
│       ├── input.tsx
│       ├── badge.tsx
│       ├── checkbox.tsx
│       ├── select.tsx
│       ├── toggle.tsx
│       ├── switch.tsx
│       ├── avatar.tsx
│       ├── skeleton.tsx
│       ├── spinner.tsx
│       └── ... (figma.manifest.json 전체)
├── lib/
│   └── utils.ts            ← cn() 등 순수 유틸
├── hooks/                  ← 공통 훅
└── types/                  ← 공통 타입
```

### 4계층 의미

| 폴더 | 역할 | Figma 대응 |
|------|------|-----------|
| `tokens/` | 색상·타이포·간격 원천 | Variables 탭 / Foundation 페이지 |
| `components/ui/` | 비즈니스 로직 없는 순수 UI | BO UI Kit 컴포넌트 |
| `lib/` | 순수 함수 (cn, formatter 등) | 없음 (개발 내부) |
| `hooks/` | 공통 React 훅 | 없음 (개발 내부) |

---

## 3. 디자이너 ↔ 개발자 통일 명칭

> 전체 용어 정의·금지 표현·소통 예시: **[FSD 주요 용어 사전](./fsd-glossary.md)**

> 아래 **"앞으로 둘 다 쓸 말"** 컬럼을 팀 공식 용어로 사용해요.

| Figma에서 부르는 말 | 코드에서 부르는 말 | **앞으로 둘 다 쓸 말** |
|------------------|----------------|-------------------|
| BO UI Kit 라이브러리 | shared 레이어 | **UI Kit / Shared** |
| Foundation 페이지 | tokens/ | **토큰 (Token)** |
| Variables (색상·타이포) | CSS 변수 / Tailwind config | **디자인 토큰** |
| 컴포넌트 (Component) | shared/components/ui/ | **컴포넌트 (Component)** |
| Variant | prop (e.g. `variant="outline"`) | **Variant / 변형** |
| State (hover/disabled 등) | prop / CSS pseudo | **상태 (State)** |
| Slot (icon 슬롯 등) | children / slot prop | **슬롯 (Slot)** |
| Auto Layout | flex / grid | **레이아웃** |
| Frame (컨테이너) | div / section | **컨테이너** |
| Instance (컴포넌트 사용) | `<Button />` JSX 태그 | **인스턴스 / 사용** |
| Story (사용 예시) | *.story.tsx | **스토리 / 사용 예시** |

### 소통 예시

> "Button 컴포넌트의 **Outline variant**, **disabled 상태** 싱크 맞춰주세요."  
> "Badge 컴포넌트 **color 토큰** `destructive` 값 바뀌었어요, 확인해주세요."  
> "icon **슬롯** 추가됐는데 **스토리**도 업데이트 필요해요."

---

## 4. Figma 핸드오프 규칙

### 파일 구조 요청 규칙

- **Figma 페이지를 FSD 레이어 기준으로 나눠 달라고 먼저 협의**  
  `Foundation / Components / Usage(Stories)` 순으로 구성 요청
- **컴포넌트 이름은 코드 파일명과 반드시 일치**  
  Figma: `Button` → 코드: `button.tsx` (대소문자만 다름, 이름 자체는 동일)
- **Shared 에셋은 BO UI Kit 라이브러리 파일 하나에 집중**

### 에셋 전달 규칙

| 에셋 종류 | 요청 포맷 | 주의 |
|----------|---------|------|
| 아이콘 | SVG + `currentColor` | PNG 금지 |
| 색상 | 토큰 이름 (e.g. `color/primary/500`) | hex 직접 전달 금지 |
| 이미지 | 1x / 2x / 3x 분리 | 용도별 최대 노출 크기 먼저 공유 |

### 핸드오프 체크리스트

개발 시작 전 반드시 확인:

- [ ] 모든 **상태** 있음? (default / hover / focus / disabled / loading / error)
- [ ] **반응형** 있음? (mobile / desktop)
- [ ] **빈 상태(Empty state)** 있음?
- [ ] **Variant** 전체 있음? (figma.manifest.json의 variants 항목 참조)
- [ ] 컴포넌트 이름이 manifest와 일치함?

### 절대 하지 말아야 할 것

- ❌ 디자인 없이 임의로 UI 구현 → 반드시 재작업 발생
- ❌ 디자인 토큰 무시하고 직접 수치 입력 (`margin: 13px`, `color: #aaa`)
- ❌ 완성되지 않은 Figma 파일로 개발 시작
- ❌ 구두(口頭)로만 결정 → 반드시 Figma 코멘트나 문서에 기록

---

## 5. Figma → React 자동 싱크 구조

> 프로젝트: `figma-to-react` | `figma.manifest.json` 기준

### 싱크 파이프라인 개요

```
Figma 변경 감지
    ↓
디자인 상태 수집 (Figma REST API / MCP)
    ↓
매니페스트 매핑 (figma.manifest.json)
    ↓
변경 컴포넌트만 추출 (Diff)
    ↓
검증 게이트 (tsc + build + lint)
    ↓
figma-sync/<version> 브랜치 → PR 생성
    ↓
사람 리뷰 → merge
```

### 현재 매핑 현황 (figma.manifest.json)

| 컴포넌트 | Figma 노드 | 코드 파일 |
|---------|-----------|---------|
| Button | `1692:74` | `src/components/ui/button.tsx` |
| Checkbox | `5667:129` | `src/components/ui/checkbox.tsx` |
| Input | `7745:699` | `src/components/ui/input.tsx` |
| Field | `7745:713` | `src/components/ui/field.tsx` |
| Badge | `9929:48567` | `src/components/ui/badge.tsx` |
| Toggle | `5685:204` | `src/components/ui/toggle.tsx` |
| Switch | `7715:1962` | `src/components/ui/switch.tsx` |
| Select | `7751:1561` | `src/components/ui/select.tsx` |
| Avatar | `1696:153` | `src/components/ui/avatar.tsx` |
| Skeleton | `7669:1885` | `src/components/ui/skeleton.tsx` |
| Spinner | `7707:393` | `src/components/ui/spinner.tsx` |
| Separator | `3605:3065` | `src/components/ui/separator.tsx` |
| Meter | `7664:31` | `src/components/ui/meter.tsx` |
| Radio Group | `7669:1454` | `src/components/ui/radio-group.tsx` |
| Segmented Control | `9705:88227` | `src/components/ui/segmented-control.tsx` |
| Input OTP | `8060:1580` | `src/components/ui/input-otp.tsx` |
| Number Field | `7781:5501` | `src/components/ui/number-field.tsx` |
| Textarea | `7751:1067` | `src/components/ui/textarea.tsx` |
| Label | `7658:2157` | `src/components/ui/label.tsx` |
| Toggle Group | `5686:270` | `src/components/ui/toggle-group.tsx` |
| Avatar Group | `1696:220` | `src/components/ui/avatar-group.tsx` |

### 주요 제약 사항

- Figma REST API `GET /v1/files/:key` 는 **파일 크기 비례 요금제**  
  → 대형 파일(BO UI Kit)은 1~2회 호출로 한도 소진 → 429 시 `Retry-After ≈ 89시간`
- 폴링 방식 ❌ → `GET /v1/files/:key/versions` (가벼움) 또는 **webhook** 사용
- `figma-local` MCP는 **Figma 데스크톱이 열려 있을 때만** 동작

---

## 6. Figma MCP 연결 방법

### Claude Code(CLI)에서 연결할 때

**필요한 것:**

1. **Figma Personal Access Token**  
   Figma → Settings → Security → Personal access tokens  
   권한: `File content: read`

2. **Figma File Key**  
   ```
   https://www.figma.com/file/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit
                                 ↑ 이게 fileKey
   ```
   → 현재 `figma.manifest.json`에 이미 저장됨: `"fileKey": "LFA5EyNbUdPvi8Rbuf2tJC"`

**설정:**

```bash
# 1. .env 파일에 토큰 저장
cp .env.example .env
# .env 열어서 FIGMA_TOKEN=your_token_here 입력

# 2. 버전 감지 스크립트로 연결 확인
npm run check:figma

# 3. 싱크 실행 (Claude Code에서)
/sync-figma
```

### claude.ai 채팅에서는?

현재 claude.ai는 MCP 직접 연결을 지원하지 않아요.  
대신 아래 방법으로 피그마 정보를 전달할 수 있어요:

- Figma 파일에서 특정 컴포넌트 JSON Export → 붙여넣기
- `figma.manifest.json` 공유 (이미 이 방식으로 분석함)
- Figma REST API URL 직접 공유

---

## 7. TDS(토스) 참고 — 구조 언어

토스 TDS가 잘 된 이유: **Figma와 코드가 같은 언어를 씀**

| TDS 용어 | 우리 프로젝트 대응 |
|---------|---------------|
| Foundation | `shared/tokens/` |
| Component | `shared/components/ui/` |
| Utility | `shared/lib/`, `shared/hooks/` |
| Story | `*.story.tsx` |

---

*이 문서는 FSD 도입 초기 팀 내 공통 언어 정립을 위한 가이드입니다.*  
*Figma 파일 업데이트 시 `figma.manifest.json`과 함께 이 문서도 갱신해주세요.*
