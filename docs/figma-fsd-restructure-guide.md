# BO UI Kit × FSD 정리 가이드 (Figma 작업 지시서)

> **대상 파일:** [BO-UI-Kit](https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=5606-1347&m=dev)  
> **기준 문서:** `fsd-designer-guide.md`  
> **작성일:** 2026-06-17  
> **목적:** Figma 파일을 FSD `shared` 레이어 구조·팀 공통 용어에 맞게 정리하고, 개발 싱크(`figma.manifest.json`)와 명칭을 통일한다.

---

## 1. 핵심 원칙 (한 줄 요약)

| Figma | 코드 (FSD) | 팀 공식 용어 |
|-------|-----------|------------|
| BO UI Kit 파일 전체 | `src/shared/` | **UI Kit / Shared** |
| Foundation (구 Styles) | `shared/tokens/` | **토큰 (Token)** |
| 컴포넌트 라이브러리 | `shared/components/ui/` | **컴포넌트 (Component)** |
| 사용 예시 프레임 | `*.story.tsx` | **스토리 / 사용 예시** |

**규칙:** Figma 컴포넌트 이름 = 코드 파일명 (PascalCase ↔ kebab-case만 변환)  
예) Figma `Button` → 코드 `button.tsx` / `Segmented Control` → `segmented-control.tsx`

---

## 2. 페이지 구조 변경 (현재 → 목표)

### 2.1 현재 구조 (Figma MCP 기준)

```
👋 Welcome
      ↳ Description
(빈 페이지)
🎨 Styles
      ↳ Colors / Typography / Spacing / Grids / Breakpoints / Icons / Effects
---
🧩 Components          ← 원자(atomic) 컴포넌트
      ↳ Avatar, Badge, Button, Checkbox, Input, ...
🧲 Utilities           ← 복합(composite) 컴포넌트
      ↳ Accordion, Alert, Autocomplete, Card, Dialog, ...
```

### 2.2 목표 구조 (FSD 가이드 §4)

```
📌 README              ← Welcome + Description 통합
🎨 Foundation          ← 구 "Styles" (토큰 전용)
      Colors
      Typography
      Spacing
      Effects
      Grids
      Breakpoints
      Icons
🧩 Components          ← shared/components/ui/ 전체 (Utilities 흡수)
      [Atomic]
      Avatar, Badge, Button, Checkbox, Input, Label, ...
      [Composite]
      Accordion, Alert, Autocomplete, Card, Dialog, ...
📖 Usage (Stories)     ← 컴포넌트별 사용 예시·다크모드·반응형
```

### 2.3 페이지별 작업 지시

| # | 현재 | 변경 후 | 작업 |
|---|------|--------|------|
| 1 | `👋 Welcome` | `📌 README` | Description 내용 병합, FSD 구조·명명 규칙 링크 추가 |
| 2 | `      ↳ Description` | (삭제) | README로 이동 |
| 3 | `(빈 페이지)` | (삭제) | 불필요 페이지 제거 |
| 4 | `🎨 Styles` | `🎨 Foundation` | 페이지명 변경. **팀 용어: 토큰** |
| 5 | `      ↳ Colors` 등 | `Colors` (들여쓰기·↳ 제거) | 하위 페이지명 정규화 |
| 6 | `---` / `------------` / `-------` | (삭제) | 구분용 빈 페이지 제거 |
| 7 | `🧩 Components` | `🧩 Components` | 유지. Utilities 흡수 |
| 8 | `🧲 Utilities` | (삭제 → Components로 이동) | **FSD에 Utilities 레이어 없음** — 코드의 `lib/`, `hooks/`는 Figma에 없음 |
| 9 | (없음) | `📖 Usage (Stories)` | **신규 생성** — 아래 §5 참고 |
| 10 | 각 컴포넌트 내 `Dark Mode Preview` | `Usage (Stories)` 하위로 이동 | 컴포넌트 페이지는 **정의(Definition)** 만 유지 |

---

## 3. 명칭 통일 규칙

### 3.1 팀 공식 용어 (fsd-designer-guide §3)

| 상황 | ❌ 피할 말 | ✅ 통일 용어 | Figma 적용 |
|------|----------|------------|-----------|
| 라이브러리 전체 | BO UI Kit 라이브러리 | **UI Kit / Shared** | 파일 설명·README에 사용 |
| 색·타이포·간격 | Styles, Style | **토큰 (Token)** | 페이지명 `Foundation`, Variables 그룹명 |
| 변형 | Type, Kind, Style | **Variant / 변형** | Component Property명 `Type` → `Variant` |
| 상호작용 | Pressed, Active 혼용 | **상태 (State)** | Property명 `State`, 값은 §3.3 표준 |
| 아이콘·콘텐츠 영역 | slot-xxx, Item01 | **슬롯 (Slot)** | `Slot / Icon`, `Slot / Items` |
| 예시 프레임 | Dark Mode Preview | **스토리 / 사용 예시** | Usage 페이지로 이동 |
| 내부 전용 | DesignSystemHeader | `.DesignSystemHeader` | 점(`.`) 접두사 유지 ✅ |

### 3.2 컴포넌트 이름 규칙

| 규칙 | 예시 |
|------|------|
| PascalCase, 공백 허용(복합어) | `Button`, `Radio Group`, `Input OTP` |
| 코드 파일명과 1:1 대응 | `Segmented Control` → `segmented-control.tsx` |
| 하위 파트는 부모+역할 | `Autocomplete` + `Autocomplete Item` (❌ `AutoCompleteItem`) |
| Boolean Property | `IsEmpty` → `Empty`, `Highlight` → `Highlighted` |
| 내부 전용 컴포넌트 | `.` 접두사 | `.DesignSystemHeader` |

### 3.3 Variant / State 표준 값

#### Variant (구 `Type`)

| Figma 현재 | 코드 prop | 통일 Variant 값 |
|-----------|----------|----------------|
| Default | `default` | `Default` |
| Outline | `outline` | `Outline` |
| Secondary | `secondary` | `Secondary` |
| Destructive | `destructive` | `Destructive` |
| DestructiveTinted | `destructive-tinted` | `Destructive Tinted` (공백 표기) |
| Link | `link` | `Link` |
| Ghost | `ghost` | `Ghost` |

#### State

| Figma 현재 | 코드/CSS | 통일 State 값 | 비고 |
|-----------|---------|--------------|------|
| Default | default | `Default` | |
| Hover | `:hover` | `Hover` | |
| Focus | `:focus` / `focus-visible` | `Focus` | |
| Pressed | `:active` | `Active` | **Pressed → Active** 로 통일 권장 |
| Disabled | `disabled` | `Disabled` | |
| Loading | `loading` | `Loading` | |
| Error | `error` / `aria-invalid` | `Error` | Input 계열 필수 |

#### Size

| Figma 현재 | 코드 prop | 통일 Size 값 |
|-----------|----------|-------------|
| Extra-small | `xs` | `Extra Small` (공백) 또는 `XS` — **팀 결정 필요** |
| Small | `sm` | `Small` |
| Default | `default` | `Default` |
| Large | `lg` | `Large` |
| Extra-large | `xl` | `Extra Large` 또는 `XL` |

> **권장:** Figma 표기는 읽기 쉬운 `Extra Small`, 코드 싱크 시 manifest에서 `xs`로 매핑.

### 3.4 슬롯 명명

| 현재 (Autocomplete 예시) | 변경 후 |
|------------------------|--------|
| `slot-autocomplete-items` | `Slot / Items` |
| `Item01`, `Item02` … | 스토리에서만 사용, 컴포넌트 정의에는 `Autocomplete Item` 인스턴스 |

---

## 4. 컴포넌트별 변경 체크리스트

### 4.1 manifest 등록됨 — Figma 페이지 확인·싱크

`figma.manifest.json`에 등록된 컴포넌트. **이름·노드 ID·Variant 전체** 일치 필요.

| 컴포넌트 | manifest 노드 | Figma 페이지 | 필요 작업 |
|---------|-------------|-------------|----------|
| Button | `1692:74` | `↳ Button` ✅ | `Type` → `Variant` 리네임. Non-default Variant에 Hover/Focus/Loading 보완 |
| Checkbox | `5667:129` | `↳ Checkbox` ✅ | State 전체 점검 |
| Input | `7745:699` | `↳ Input` ✅ | Error 상태 추가 여부 확인 |
| Field | `7745:713` | `↳ Field` (Utilities) | **Components로 이동** |
| Badge | `9929:48567` | `↳ Badge` ✅ | color Variant manifest와 대조 |
| Toggle | `5685:204` | `↳ Toggle` ✅ | |
| Switch | `7715:1962` | `↳ Switch` ✅ | |
| Select | `7751:1561` | `↳ Select` ✅ | `↳ Dropdown` 과 역할 구분 문서화 |
| Avatar | `1696:153` | `↳ Avatar` ✅ | Avatar Group 포함 여부 확인 |
| Skeleton | `7669:1885` | `↳ Skeleton` ✅ | |
| Spinner | `7707:393` | `↳ Spinner` ✅ | |
| Separator | `3605:3065` | `↳ Separator` ✅ | |
| Meter | `7664:31` | `↳ Meter` ✅ | |
| Radio Group | `7669:1454` | `↳ Radio Group` ✅ | |
| Segmented Control | `9705:88227` | **페이지 없음** ⚠️ | **신규 페이지 생성 필수** |
| Input OTP | `8060:1580` | `↳ Input OTP` (Utilities) | Components로 이동 |
| Number Field | `7781:5501` | `↳ Number Field` ✅ | |
| Textarea | `7751:1067` | `↳ Textarea` ✅ | |
| Label | `7658:2157` | `↳ Label` ✅ | |
| Toggle Group | `5686:270` | `↳ Toggle Group` (Utilities) | Components로 이동 |
| Avatar Group | `1696:220` | Avatar 페이지 내 확인 필요 | 독립 페이지 또는 Avatar 하위 섹션으로 명시 |

### 4.2 Figma에만 있음 — manifest·코드 추가 여부 결정

아래는 Figma에 존재하나 manifest 미등록. **우선순위**와 함께 팀 결정 필요.

| 컴포넌트 | 현재 위치 | 권장 조치 |
|---------|----------|----------|
| Collapsible | Components | P2 — manifest 추가 검토 |
| Pagination | Components | P2 |
| Dropdown | Components | P1 — Select와 관계 정의 후 manifest |
| Sheet | Components | P2 |
| Tooltip | Components | P1 |
| Accordion | Utilities | P1 — Components로 이동 |
| Alert | Utilities | P1 |
| Alert Dialog | Utilities | P1 |
| **Autocomplete** | Utilities | P1 — `AutoCompleteItem` → `Autocomplete Item` 리네임 |
| Breadcrumb | Utilities | P2 |
| Calendar | Utilities | P2 |
| Card | Utilities | P1 |
| Checkbox Group | Utilities | P1 |
| Combobox | Utilities | P1 — Autocomplete와 차이 README에 명시 |
| Date Picker | Utilities | P2 |
| Dialog | Utilities | P1 |
| Drawer | Utilities | P2 |
| Empty | Utilities | P1 |
| Fieldset | Utilities | P2 |
| Form | Utilities | P2 — FSD `features`와 혼동 주의, README에 "UI Kit Form = 레이아웃 래퍼" 명시 |
| Frame | Utilities | P3 — 코드 `div` 대응, manifest 불필요 가능 |
| Group | Utilities | P3 |
| Input Group | Utilities | P1 |
| Menu | Utilities | P1 |
| Popover | Utilities | P1 |
| Progress | Utilities | P2 |
| Scroll Area | Utilities | P2 |
| Slider | Utilities | P2 |
| Tabs | Utilities | P1 |
| Toast | Utilities | P1 |
| Toolbar | Utilities | P2 |
| Table | Utilities | P1 |
| Chart | Utilities | P3 — 디버그용으로 보임, 정리 또는 삭제 검토 |

### 4.3 Autocomplete 상세 (요청 노드 `5606:1347`)

[해당 프레임](https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=5606-1347&m=dev) 기준 즉시 수정 항목:

| 현재 | 변경 후 | 이유 |
|------|--------|------|
| 페이지명 `      ↳ Autocomplete` | `Autocomplete` | 들여쓰기·화살표 제거 |
| `AutoCompleteItem` | `Autocomplete Item` | 부모명 일관성 |
| `IsEmpty=False` / `IsEmpty=True` | `Empty=False` / `Empty=True` | Boolean 명명 통일 |
| `Highlight=False` / `Highlight=True` | `State=Default` / `State=Highlighted` | State 속성으로 통합 |
| `Dark Mode Preview` | `Usage / Autocomplete / Dark Mode` | 스토리 페이지로 분리 |
| `slot-autocomplete-items` | `Slot / Items` | 슬롯 명명 규칙 |
| `Item01` ~ `Item06` | 스토리 전용 인스턴스 | 정의 페이지에서 제거 |

---

## 5. Usage (Stories) 페이지 구성

각 컴포넌트마다 컴포넌트 정의 페이지에 섞여 있는 예시를 분리한다.

### 5.1 폴더 구조 (Figma 페이지)

```
📖 Usage (Stories)
   Button
      Default Examples
      Dark Mode
      With Icon (Slot)
   Autocomplete
      With Items
      Empty State
      Dark Mode
   Input
      With Label + Field
      Error State
   ...
```

### 5.2 스토리에 포함할 최소 세트 (fsd-designer-guide §4 체크리스트)

- [ ] **상태:** Default / Hover / Focus / Disabled / Loading / Error
- [ ] **Variant:** manifest variants 전체
- [ ] **반응형:** Mobile / Desktop (해당 시)
- [ ] **Empty state:** 해당 시
- [ ] **슬롯 사용 예:** icon, items 등

---

## 6. Foundation (토큰) 정리

### 6.1 Variables 그룹명 (권장)

```
color/
   primary/
   destructive/
   ...
typography/
   font-size/
   font-weight/
spacing/
   ...
radius/
   ...
effect/
   shadow/
```

### 6.2 금지 사항

- ❌ 컴포넌트에 hex/rgb **직접 입력** — Variables 바인딩 필수
- ❌ `margin: 13px` 같은 비토큰 수치 — Spacing 토큰만 사용
- ❌ Styles 페이지에 컴포넌트 정의 혼재 — `.DesignSystemHeader`만 허용(내부용)

### 6.3 코드 매핑

| Figma Foundation | 코드 |
|-----------------|------|
| Colors | `shared/tokens/colors.css` |
| Typography | `shared/tokens/typography.css` |
| Spacing | `shared/tokens/spacing.css` |
| Effects | `shared/tokens/effects.css` |
| Grids / Breakpoints | `shared/tokens/` 또는 tailwind config |

---

## 7. 레이어·프레임 구조 템플릿

컴포넌트 페이지마다 동일한 구조를 적용한다.

```
[Page] Autocomplete
└── [Frame] Autocomplete — Definition
    ├── [Instance] .DesignSystemHeader
    ├── [Component Set] Autocomplete
    │   ├── Empty=False
    │   └── Empty=True
    └── [Component Set] Autocomplete Item
        ├── State=Default
        └── State=Highlighted

[Page] Usage (Stories)
└── [Frame] Autocomplete / With Items
    └── [Instance] Autocomplete (Empty=False)
        └── [Slot / Items]
            ├── Autocomplete Item
            └── ...
```

**제거 대상:** 각 컴포넌트 페이지 내 `Dark Mode Preview` 프레임 (Usage로 이전)

---

## 8. 우선순위 작업 순서 (디자이너용)

### Phase 1 — 구조 (1~2일)

1. [ ] 빈 페이지·구분선(`---`) 페이지 삭제
2. [ ] `Styles` → `Foundation` 리네임
3. [ ] 하위 페이지 `↳` · 선행 공백 전부 제거
4. [ ] `Utilities` 컴포넌트 전부 `Components`로 이동
5. [ ] `Usage (Stories)` 페이지 생성
6. [ ] `Segmented Control` 페이지 신규 생성 (manifest 노드 `9705:88227` 연결)

### Phase 2 — 명명 (2~3일)

7. [ ] 전 컴포넌트: `Type` property → `Variant`
8. [ ] `Pressed` → `Active` (또는 팀 합의안 문서화)
9. [ ] `IsEmpty` / `Highlight` 등 Boolean property 정규화
10. [ ] `AutoCompleteItem` 등 camelCase 파트명 수정
11. [ ] 슬롯명 `slot-*` → `Slot / *` 형식

### Phase 3 — 완성도 (3~5일)

12. [ ] manifest 21개 컴포넌트 State·Variant 누락분 보완
13. [ ] `Dark Mode Preview` → Usage로 이전
14. [ ] README에 Select/Dropdown, Autocomplete/Combobox 차이 명시
15. [ ] Variables hex 직접 사용 여부 전수 점검

### Phase 4 — 싱크 (개발 협업)

16. [ ] 변경된 노드 ID → `figma.manifest.json` 업데이트
17. [ ] `fsd-designer-guide.md` 매핑 테이블 갱신
18. [ ] `npm run check:figma` 로 연결 확인

---

## 9. FSD 레이어와 Figma 경계 (혼동 방지)

BO UI Kit 파일은 **전부 `shared` 레이어**다. 아래는 Figma에 **만들지 않는다**.

| FSD 레이어 | 코드 위치 | Figma |
|-----------|----------|-------|
| `app` | `src/app/` | ❌ 별도 파일 (앱 프로젝트 Figma) |
| `pages` | `src/pages/` | ❌ 별도 파일 |
| `widgets` | `src/widgets/` | ❌ 별도 파일 |
| `features` | `src/features/` | ❌ 별도 파일 |
| `entities` | `src/entities/` | ❌ 별도 파일 |
| `shared` | `src/shared/` | ✅ **이 파일 (BO UI Kit)** |

> `Form`, `Card`, `Dialog` 등은 UI Kit의 **복합 컴포넌트**이지 FSD `features`가 아니다.  
> 페이지(화면) 단위 디자인은 **앱 Figma 파일**에서 `pages` / `widgets` 명명으로 관리한다.

---

## 10. 부록 — 전체 페이지 인벤토리 (2026-06-17 기준)

### Foundation (구 Styles)
- Colors, Typography, Spacing, Grids, Breakpoints, Icons, Effects

### Components (현재)
Avatar, Badge, Button, Checkbox, Collapsible, Input, Label, Meter, Number Field, Pagination, Textarea, Radio Group, Select, Dropdown, Separator, Sheet, Spinner, Skeleton, Switch, Toggle, Tooltip

### Utilities → Components로 통합 예정
Accordion, Alert, Alert Dialog, Autocomplete, Breadcrumb, Calendar, Card, Checkbox Group, Combobox, Date Picker, Dialog, Drawer, Empty, Field, Fieldset, Form, Frame, Group, Input Group, Input OTP, Menu, Popover, Progress, Scroll Area, Slider, Tabs, Toast, Toggle Group, Toolbar, Table, Chart

### manifest 있으나 Figma 페이지 없음
- **Segmented Control** (`9705:88227`) ⚠️

---

*이 문서는 Figma 정리 작업이 끝날 때마다 `figma.manifest.json`, `fsd-designer-guide.md`와 함께 갱신해주세요.*
