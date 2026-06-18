# FSD 운영 가이드 — Figma부터 구현까지

> **프로젝트:** BO UI Kit  
> **대상:** 디자인팀, UI팀(프론트엔드)  
> **작성일:** 2026-06-17  
> **버전:** 1.0  
> **선행 문서:** [FSD 협업 개요](./fsd-overview.md)

---

## 목차

1. [작업 흐름 총览](#1-작업-흐름-총览)
2. [디자인팀 가이드](#2-디자인팀-가이드)
3. [UI팀 가이드](#3-ui팀-가이드)
4. [명명 규칙 (공통)](#4-명명-규칙-공통)
5. [레이어별 판단 기준](#5-레이어별-판단-기준)
6. [핸드오프 프로세스](#6-핸드오프-프로세스)
7. [Figma → 코드 싱크](#7-figma--코드-싱크)
8. [체크리스트 모음](#8-체크리스트-모음)
9. [안티패턴](#9-안티패턴)

---

## 1. 작업 흐름 총览

### 1.1 신규 UI 컴포넌트 추가 (shared)

```
[디자인] Foundation 토큰 확인
    → [디자인] Components에 정의 (Variant·State·Slot)
    → [디자인] Usage에 스토리 추가
    → [디자인] 핸드오프 (Figma 링크 + 체크리스트)
    → [UI] manifest 등록
    → [UI] shared/components/ui 구현
    → [UI] Storybook 스토리 작성
    → [양팀] 리뷰 · merge
```

### 1.2 화면(페이지) 구현 (pages 이상)

```
[디자인] 앱 Figma에 pages/widgets/features 설계
    → [디자인] UI Kit 컴포넌트 Instance로 조립 (신규 그리기 최소화)
    → [디자인] 화면 링크 + 사용 컴포넌트 목록 전달
    → [UI] pages / widgets / features 폴더에 구현
    → [UI] shared만 import (역방향 금지)
    → [양팀] 화면 QA
```

### 1.3 디자인 변경 (기존 컴포넌트)

```
[디자인] Figma 수정 + 코멘트로 변경 내용 기록
    → [UI] manifest 노드 diff 확인
    → [UI] 싱크 PR 또는 수동 수정
    → [양팀] 영향 범위 확인 (다른 화면 깨짐 여부)
```

---

## 2. 디자인팀 가이드

### 2.1 Figma 파일 분리 원칙

| 파일 | 내용 | FSD |
|------|------|-----|
| **BO UI Kit** | 토큰 + UI 컴포넌트 + 스토리 | `shared` |
| **앱 Figma** | 화면 + 섹션 + 기능 플로우 | `pages` 이상 |

두 파일을 혼용하지 않습니다. 화면 디자인 중 UI Kit에 없는 부품이 필요하면 **UI Kit에 먼저 추가**한 뒤 Instance로 사용합니다.

### 2.2 BO UI Kit 페이지 구조

```
📌 README
   - FSD 구조 설명 링크
   - 명명 규칙 요약
   - 버전·변경 이력

🎨 Foundation
   Colors / Typography / Spacing / Effects / Grids / Breakpoints / Icons

🧩 Components
   [Atomic]  Button, Input, Badge, Checkbox …
   [Composite] Dialog, Card, Form, Tabs …

📖 Usage (Stories)
   컴포넌트별 사용 예시, 다크모드, 반응형, Empty state
```

상세 정리 작업: [figma-fsd-restructure-guide.md](./figma-fsd-restructure-guide.md)

### 2.3 컴포넌트 페이지 템플릿

각 컴포넌트 페이지는 **정의(Definition)만** 포함합니다.

```
[Page] Button
└── [Frame] Button — Definition
    ├── [Instance] .DesignSystemHeader
    └── [Component Set] Button
        ├── Variant=Default, Size=Default, State=Default
        ├── Variant=Default, Size=Default, State=Hover
        ├── Variant=Outline, Size=Default, State=Default
        └── …
```

- `.DesignSystemHeader` — 내부용 (점 접두사)
- `Dark Mode Preview` — **Usage 페이지로 분리** (Definition에 두지 않음)

### 2.4 Component Property 규칙

| Property | 용도 | 값 예시 |
|----------|------|--------|
| `Variant` | 시각적 변형 | Default, Outline, Destructive |
| `Size` | 크기 | Small, Default, Large |
| `State` | 상호작용 상태 | Default, Hover, Focus, Active, Disabled, Loading, Error |
| `Empty` | Boolean (콘텐츠 유무) | True, False |
| Slot | 콘텐츠 영역 | `Slot / Icon`, `Slot / Items` |

**금지:** `Type` (→ `Variant`로 통일), `IsEmpty` (→ `Empty`), `Pressed` (→ `Active`)

### 2.5 토큰(Foundation) 규칙

```
Variables 구조 (권장)
color/
  primary/
  destructive/
typography/
  font-size/
spacing/
radius/
effect/
  shadow/
```

| 규칙 | 내용 |
|------|------|
| ✅ Variables 바인딩 | 모든 색·간격·radius |
| ✅ 토큰 이름으로 소통 | `color/primary/500` |
| ❌ hex 직접 입력 | 컴포넌트 fill에 #값 금지 |
| ❌ 임의 수치 | 13px 같은 비표준 spacing 금지 |

### 2.6 앱 Figma (화면) 구조

```
📌 README
📄 Pages/          ← URL 1개 = 페이지 1개 (e.g. Home, Settings)
🧱 Widgets/       ← 여러 페이지에서 재사용 섹션 (e.g. AppHeader)
⚡ Features/      ← 사용자 행동 (e.g. AddToCart, LoginForm)
📦 Entities/     ← 도메인 단위 (e.g. ProductCard, UserAvatar)
```

**네이밍:** Figma 프레임명 = 코드 슬라이스명 (PascalCase)  
예) `Pages / Home` → `pages/home/`, `Features / AddToCart` → `features/add-to-cart/`

### 2.7 에셋 전달 규칙

| 에셋 | 포맷 | 금지 |
|------|------|------|
| 아이콘 | SVG + `currentColor` | PNG 아이콘 |
| 색상 | 토큰 이름 | hex 직접 전달 |
| 이미지 | 1x / 2x / 3x | 용도·최대 크기 미공유 |

---

## 3. UI팀 가이드

### 3.1 코드 폴더 구조

```
src/
├── app/                    # 앱 설정, Provider, 글로벌 스타일
├── pages/                  # 라우트 단위 화면
│   └── home/
│       ├── ui/
│       └── index.ts
├── widgets/                # 독립 섹션
│   └── header/
├── features/               # 사용자 행동
│   └── add-to-cart/
├── entities/               # 비즈니스 엔티티
│   └── product/
└── shared/                 # UI Kit (= BO UI Kit Figma)
    ├── tokens/
    │   ├── colors.css
    │   ├── typography.css
    │   └── spacing.css
    ├── components/
    │   └── ui/
    │       ├── button.tsx
    │       └── input.tsx
    ├── lib/
    ├── hooks/
    └── types/
```

### 3.2 Import 규칙 (필수)

```
✅ pages     → widgets, features, entities, shared
✅ widgets   → features, entities, shared
✅ features  → entities, shared
✅ entities  → shared
✅ shared    → shared 내부만

❌ shared    → features (금지)
❌ entities  → features (금지)
❌ features  → widgets (금지)
❌ 하위      → 상위 레이어 (금지)
```

### 3.3 shared/components/ui 구현 원칙

| 원칙 | 설명 |
|------|------|
| **순수 UI** | API 호출·비즈니스 로직 금지 |
| **토큰 사용** | `var(--color-primary)` / tailwind 토큰 클래스 |
| **Figma 1:1** | 컴포넌트명·Variant·State = Figma와 동일 |
| **접근성** | aria-* , keyboard focus, role 속성 |
| **합성 가능** | Slot은 children / compound pattern |

```tsx
// ✅ 올바른 예 — shared/components/ui/button.tsx
export function Button({
  variant = "default",
  size = "default",
  disabled,
  loading,
  children,
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }))}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}
```

```tsx
// ❌ 잘못된 예 — shared에 비즈니스 로직
export function Button({ productId }: { productId: string }) {
  const { addToCart } = useCart(); // features 로직 → shared에 금지
  return <button onClick={() => addToCart(productId)}>담기</button>;
}
```

### 3.4 pages / features 구현 원칙

```tsx
// ✅ features/add-to-cart/ui/AddToCartButton.tsx
import { Button } from "@/shared/components/ui/button";
import { useAddToCart } from "../model/useAddToCart";

export function AddToCartButton({ productId }: Props) {
  const { mutate, isLoading } = useAddToCart();
  return (
    <Button variant="default" loading={isLoading} onClick={() => mutate(productId)}>
      장바구니 담기
    </Button>
  );
}
```

- **shared `Button`** = UI Kit 컴포넌트 (디자인 스펙)
- **features `AddToCartButton`** = 비즈니스 로직 + Button 조립

### 3.5 슬라이스 내부 구조 (권장)

```
features/add-to-cart/
├── ui/           # React 컴포넌트
├── model/        # 상태, hooks, API
├── api/          # 요청 함수
├── lib/          # 슬라이스 내부 유틸
└── index.ts      # Public API (외부 export)
```

**Public API:** 다른 슬라이스는 `index.ts`만 import합니다.

```tsx
// ✅
import { AddToCartButton } from "@/features/add-to-cart";

// ❌ 내부 파일 직접 import
import { AddToCartButton } from "@/features/add-to-cart/ui/AddToCartButton";
```

### 3.6 Storybook (스토리)

| Figma | 코드 |
|-------|------|
| Usage (Stories) | `*.stories.tsx` |

```tsx
// button.stories.tsx
export const Outline: Story = {
  args: { variant: "outline", children: "Button" },
};

export const Disabled: Story = {
  args: { variant: "default", disabled: true, children: "Button" },
};
```

Figma Usage 페이지와 Storybook 스토리 **1:1 대응**을 목표로 합니다.

---

## 4. 명명 규칙 (공통)

### 4.1 컴포넌트

| Figma | 코드 파일 | 코드 export |
|-------|----------|-------------|
| `Button` | `button.tsx` | `Button` |
| `Radio Group` | `radio-group.tsx` | `RadioGroup` |
| `Input OTP` | `input-otp.tsx` | `InputOTP` |
| `Segmented Control` | `segmented-control.tsx` | `SegmentedControl` |

### 4.2 Variant / State / Size

| Figma Property 값 | 코드 prop 값 |
|------------------|-------------|
| `Variant=Outline` | `variant="outline"` |
| `State=Active` | CSS `:active` 또는 `data-state="active"` |
| `State=Disabled` | `disabled` prop |
| `State=Loading` | `loading` prop |
| `Size=Small` | `size="sm"` |

> Figma는 읽기 쉬운 `Outline`, `Small` — 코드는 camelCase/kebab-case.  
> 매핑은 `figma.manifest.json`에 명시합니다.

### 4.3 토큰

| Figma Variable | CSS 변수 (예) |
|---------------|-------------|
| `color/primary/500` | `--color-primary-500` |
| `spacing/4` | `--spacing-4` |
| `typography/body/md` | `--font-size-body-md` |

### 4.4 공식 용어표

> 상세 정의·Variant/State 전체 목록·금지 표현: **[FSD 주요 용어 사전](./fsd-glossary.md)**

| ❌ 쓰지 않을 말 | ✅ 공식 용어 |
|--------------|------------|
| BO UI Kit 라이브러리 | UI Kit / Shared |
| Styles | 토큰 (Token) / Foundation |
| Type (property) | Variant |
| Pressed | Active (State) |
| Dark Mode Preview | 스토리 (Story) |
| slot-xxx | Slot / Icon, Slot / Items |

---

## 5. 레이어별 판단 기준

새 UI 요소를 어디에 둘지 결정할 때 아래 순서로 판단합니다.

```
Q1. 비즈니스 로직·API가 있는가?
    YES → features 또는 entities
    NO  → Q2

Q2. 특정 도메인(User, Product)에 묶이는가?
    YES → entities
    NO  → Q3

Q3. 여러 페이지에서 쓰이는 큰 섹션인가?
    YES → widgets
    NO  → Q4

Q4. URL 단위 전체 화면인가?
    YES → pages
    NO  → Q5

Q5. 순수 UI 부품인가? (Button, Input, Dialog)
    YES → shared/components/ui
    NO  → 다시 Q1부터 검토
```

### 예시

| UI 요소 | 레이어 | 이유 |
|---------|--------|------|
| Button | shared | 순수 UI, 도메인 무관 |
| Dialog | shared | 순수 UI 셸 |
| LoginForm | features | 로그인 행동 + API |
| ProductCard | entities | Product 도메인 |
| AppHeader | widgets | 여러 페이지 공통 섹션 |
| HomePage | pages | URL `/home` |
| color/primary | shared/tokens | 디자인 토큰 |

---

## 6. 핸드오프 프로세스

### 6.1 디자인 → UI 핸드오프 양식

```markdown
## 핸드오프: [컴포넌트/화면명]

**유형:** [ ] shared 컴포넌트  [ ] 페이지  [ ] feature  [ ] widget

**Figma 링크:**
https://www.figma.com/design/...?node-id=...

**변경 요약:**
- (변경 내용 1~3줄)

**사용 토큰:**
- color/primary/500, spacing/4 …

**체크리스트:**
- [ ] Variant 전체
- [ ] State 전체
- [ ] Empty state
- [ ] 스토리(Usage)
- [ ] 반응형 (해당 시)

**manifest 업데이트 필요:** [ ] Yes  [ ] No
```

### 6.2 UI → 디자인 피드백

구현 완료 후 Storybook URL 또는 PR 링크를 디자인팀에 전달합니다.

```markdown
## 구현 완료: Button

**PR:** #123
**Storybook:** /button
**Figma 대비 차이:** 없음 / (차이점 기술)
```

### 6.3 리뷰 참여자

| 단계 | 디자인 | UI | 필수 |
|------|--------|-----|------|
| shared 컴포넌트 신규 | ✅ 스펙 리뷰 | ✅ 구현 | 양팀 |
| 토큰 변경 | ✅ 값 확인 | ✅ CSS 반영 | 양팀 |
| pages 화면 | ✅ 화면 QA | ✅ 구현 | 양팀 |
| features 로직 | 선택 | ✅ | UI |

---

## 7. Figma → 코드 싱크

### 7.1 manifest (`figma.manifest.json`)

Figma 노드 ID와 코드 파일을 연결하는 **단일 진실 공급원(SSOT)** 입니다.

```json
{
  "fileKey": "LFA5EyNbUdPvi8Rbuf2tJC",
  "components": {
    "Button": {
      "nodeId": "1692:74",
      "path": "src/shared/components/ui/button.tsx",
      "variants": ["default", "outline", "secondary", "destructive", "ghost", "link"]
    }
  }
}
```

### 7.2 싱크 파이프라인

```
Figma 변경
  → 버전 감지 (versions API / webhook)
  → manifest 기준 diff
  → 변경 컴포넌트만 추출
  → tsc + lint + build
  → figma-sync/<version> 브랜치 PR
  → 양팀 리뷰 → merge
```

### 7.3 현재 manifest 등록 컴포넌트 (21개)

Button, Checkbox, Input, Field, Badge, Toggle, Switch, Select, Avatar, Skeleton, Spinner, Separator, Meter, Radio Group, Segmented Control, Input OTP, Number Field, Textarea, Label, Toggle Group, Avatar Group

> Figma에 없거나 위치가 다른 항목: [figma-fsd-restructure-guide.md](./figma-fsd-restructure-guide.md) 참고

### 7.4 싱크 대상이 아닌 것

- `pages` / `widgets` / `features` / `entities` — **수동 구현**
- manifest 미등록 Figma 컴포넌트 — 등록 후 싱크 대상 편입

---

## 8. 체크리스트 모음

### 8.1 디자인 — shared 컴포넌트 완료 기준

- [ ] Foundation 토큰 Variables 바인딩
- [ ] 컴포넌트명 = 코드 파일명
- [ ] Property: Variant, Size, State (해당 시)
- [ ] State: Default, Hover, Focus, Active, Disabled, Loading, Error
- [ ] Slot 정의 (해당 시)
- [ ] Usage(Stories)에 다크모드·Empty·조합 예시
- [ ] Figma 코멘트에 변경 이력

### 8.2 UI — shared 컴포넌트 완료 기준

- [ ] `shared/components/ui/` 에 구현
- [ ] 토큰만 사용 (하드코딩 색·간격 없음)
- [ ] manifest 등록·노드 ID 정확
- [ ] Storybook 스토리 = Figma Usage 대응
- [ ] tsc + lint 통과
- [ ] 접근성 (focus, aria) 확인

### 8.3 UI — 화면(pages) 완료 기준

- [ ] Figma 화면 링크와 1:1 대응
- [ ] shared / entities / features 만 import
- [ ] Public API (`index.ts`) 통해 cross-slice import
- [ ] 반응형 (디자인 breakpoint 준수)

### 8.4 핸드오프 전 최종 (양팀)

- [ ] Figma 링크에 `node-id` 포함
- [ ] 체크리스트 전항 완료
- [ ] 구두 결정 사항 문서화
- [ ] manifest / 가이드 문서 갱신 (해당 시)

---

## 9. 안티패턴

### 디자인

| ❌ 안티패턴 | ✅ 올바른 방법 |
|-----------|--------------|
| 화면 Figma에서 Button 새로 그림 | UI Kit Button Instance 사용 |
| hex 직접 입력 | 토큰 Variables |
| 컴포넌트마다 다른 Property명 | Variant / State 통일 |
| Definition에 Dark Mode 섞음 | Usage 페이지로 분리 |
| 구두로만 스펙 변경 | Figma 코멘트 + 문서 |

### UI

| ❌ 안티패턴 | ✅ 올바른 방법 |
|-----------|--------------|
| `margin: 13px` 하드코딩 | spacing 토큰 |
| shared에 API 호출 | features로 분리 |
| features → pages import | 역방향 금지 |
| 슬라이스 내부 파일 직접 import | `index.ts` Public API |
| manifest 없이 Figma 수동 대조 | manifest SSOT |

---

## 부록 A. 문서 갱신 규칙

| 변경 유형 | 갱신 문서 |
|----------|----------|
| Figma 구조 변경 | figma-fsd-restructure-guide.md |
| manifest 컴포넌트 추가 | fsd-designer-guide.md §5, figma.manifest.json |
| 용어 추가·변경 | fsd-overview.md §6, 이 문서 §4 |
| 프로세스 변경 | 이 문서 §6, §7 |

---

## 부록 B. 관련 문서

| 문서 | 용도 |
|------|------|
| [fsd-overview.md](./fsd-overview.md) | 개요·역할·흐름 |
| [fsd-glossary.md](./fsd-glossary.md) | **주요 용어 사전** |
| [fsd-designer-guide.md](./fsd-designer-guide.md) | 디자이너 상세·싱크·MCP |
| [figma-fsd-restructure-guide.md](./figma-fsd-restructure-guide.md) | Figma 정리 작업 지시 |
| [figma-fsd-restructure-slack.txt](./figma-fsd-restructure-slack.txt) | 슬랙 공유용 요약 |

---

*이 문서는 Figma부터 코드 구현까지의 실무 기준입니다.*  
*예외 사항은 팀 합의 후 이 문서에 기록해주세요.*
