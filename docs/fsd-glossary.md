# FSD 주요 용어 사전

> **프로젝트:** BO UI Kit  
> **대상:** 디자인팀, UI팀(프론트엔드)  
> **작성일:** 2026-06-17  
> **버전:** 1.0

디자인팀과 UI팀이 **같은 말로 같은 것을 가리키기** 위한 공식 용어 사전입니다.  
협업·핸드오프·코드 리뷰·Figma 작업 시 이 문서의 **공식 용어** 열을 사용합니다.

**관련 문서**
- [FSD 협업 개요](./fsd-overview.md)
- [FSD 운영 가이드](./fsd-operations-guide.md)
- [FSD × 디자이너 협업 가이드](./fsd-designer-guide.md)

---

## 읽는 법

| 열 | 설명 |
|----|------|
| **공식 용어** | 팀 내 소통·문서·Figma·코드에 쓸 표준 이름 |
| **Figma** | Figma에서의 표현 |
| **코드** | 코드베이스에서의 표현 |
| **비고** | 주의사항, 금지 표현, 예시 |

---

## 1. FSD 아키텍처

| 공식 용어 | Figma | 코드 | 비고 |
|----------|-------|------|------|
| **FSD** | — | Feature-Sliced Design | 프론트엔드 레이어 구조 방법론 |
| **레이어 (Layer)** | Figma 최상위 페이지 구분 | `src/app`, `src/pages` … | 6개 + app |
| **슬라이스 (Slice)** | 기능 단위 프레임/섹션 | `features/add-to-cart/` | 레이어 안의 기능 단위 폴더 |
| **세그먼트 (Segment)** | — | `ui/`, `model/`, `api/` | 슬라이스 내부 하위 폴더 |
| **Public API** | — | `index.ts` | 슬라이스 외부 export 진입점. 내부 파일 직접 import 금지 |
| **역방향 import** | — | 하위 → 상위 참조 | **금지.** e.g. shared → features |
| **app** | 앱 README·글로벌 테마 | `src/app/` | Provider, 라우터, 글로벌 스타일 |
| **pages** | 화면·스크린 | `src/pages/` | URL 1개 = 페이지 1개 |
| **widgets** | 섹션·패널·블록 | `src/widgets/` | 여러 페이지에서 재사용되는 큰 UI 블록 |
| **features** | 기능·유저 플로우 | `src/features/` | 사용자 **행동** 단위 (로그인, 장바구니 담기) |
| **entities** | 도메인 오브젝트·카드 | `src/entities/` | 비즈니스 **개념** 단위 (User, Product) |
| **shared** | UI Kit·디자인 시스템 | `src/shared/` | 도메인·로직 없는 공통 요소 |

---

## 2. 디자인 시스템 · 파일

| 공식 용어 | Figma | 코드 | 비고 |
|----------|-------|------|------|
| **UI Kit / Shared** | BO UI Kit 파일 | `src/shared/` | ❌ "BO UI Kit 라이브러리"만 단독 사용 지양 |
| **BO UI Kit** | Figma 파일명 | `shared` 레이어 전체 | File Key: `LFA5EyNbUdPvi8Rbuf2tJC` |
| **앱 Figma** | 화면·플로우 파일 (별도) | `pages` 이상 | UI Kit 파일과 **분리** 운영 |
| **Foundation** | `🎨 Foundation` 페이지 | `shared/tokens/` | ❌ Styles (구 명칭, 사용 중단) |
| **Components** | `🧩 Components` 페이지 | `shared/components/ui/` | UI 컴포넌트 **정의** |
| **Usage (Stories)** | `📖 Usage (Stories)` 페이지 | `*.stories.tsx` | 사용 **예시**. ❌ Dark Mode Preview |
| **Definition** | 컴포넌트 스펙 프레임 | 컴포넌트 구현체 | Variant·State 정의. 예시와 분리 |
| **Atomic 컴포넌트** | Components 내 [Atomic] | `button.tsx` 등 | 단일 UI 부품 |
| **Composite 컴포넌트** | Components 내 [Composite] | `dialog.tsx`, `card.tsx` | 여러 부품의 조합. **shared**에 위치 (features 아님) |

---

## 3. 토큰 · 스타일

| 공식 용어 | Figma | 코드 | 비고 |
|----------|-------|------|------|
| **토큰 (Token)** | Variables | CSS 변수, Tailwind config | ❌ "Styles", "Style" 단독 사용 지양 |
| **디자인 토큰** | Variables (색·타이포·간격) | `--color-primary-500` | hex 직접 전달·하드코딩 금지 |
| **color 토큰** | `color/primary/500` | `--color-primary-500` | |
| **spacing 토큰** | `spacing/4` | `--spacing-4` | ❌ `margin: 13px` 같은 임의 수치 |
| **typography 토큰** | `typography/body/md` | `--font-size-body-md` | |
| **radius 토큰** | `radius/md` | `--radius-md` | |
| **effect 토큰** | `effect/shadow/md` | `box-shadow` 변수 | |
| **Variables** | Figma Variables 탭 | — | 토큰의 Figma 구현체 |
| **Breakpoint** | Foundation > Breakpoints | tailwind `sm`, `md` … | 반응형 기준점 |

---

## 4. 컴포넌트 · 속성

| 공식 용어 | Figma | 코드 | 비고 |
|----------|-------|------|------|
| **컴포넌트 (Component)** | Component / Component Set | `Button`, `button.tsx` | Figma PascalCase ↔ 코드 kebab-case 파일명 |
| **Component Set** | Figma Component Set | — | Variant·State 조합 묶음 |
| **인스턴스 (Instance)** | Instance | `<Button />` JSX | 컴포넌트 **사용** |
| **Variant / 변형** | Property `Variant` | `variant="outline"` | ❌ Type, Kind, Style |
| **상태 (State)** | Property `State` | CSS pseudo, `disabled`, `loading` | ❌ Pressed → **Active** 로 통일 |
| **Size** | Property `Size` | `size="sm"` | Extra Small ↔ `xs` (manifest 매핑) |
| **슬롯 (Slot)** | `Slot / Icon`, `Slot / Items` | `children`, slot prop | ❌ `slot-xxx`, `Item01` |
| **Empty** | Property `Empty=True/False` | empty state UI | ❌ `IsEmpty` |
| **레이아웃** | Auto Layout | flex / grid | |
| **컨테이너** | Frame | `div`, `section` | |

### Variant 표준 값

| 공식 Variant | 코드 값 | 비고 |
|-------------|--------|------|
| Default | `default` | |
| Outline | `outline` | |
| Secondary | `secondary` | |
| Destructive | `destructive` | |
| Destructive Tinted | `destructive-tinted` | Figma: 공백 표기 |
| Link | `link` | |
| Ghost | `ghost` | |

### State 표준 값

| 공식 State | 코드 표현 | 비고 |
|-----------|----------|------|
| Default | 기본 스타일 | |
| Hover | `:hover` | |
| Focus | `:focus`, `focus-visible` | |
| Active | `:active`, `data-state="active"` | ❌ Pressed |
| Disabled | `disabled` prop | |
| Loading | `loading` prop, `aria-busy` | |
| Error | `error`, `aria-invalid` | Input 계열 필수 |
| Highlighted | `data-state="highlighted"` | ❌ Highlight (boolean) |

### Size 표준 값

| 공식 Size (Figma) | 코드 값 |
|------------------|--------|
| Extra Small | `xs` |
| Small | `sm` |
| Default | `default` |
| Large | `lg` |
| Extra Large | `xl` |

---

## 5. 코드 · 구현

| 공식 용어 | Figma | 코드 | 비고 |
|----------|-------|------|------|
| **순수 UI** | Component 정의 | `shared/components/ui/` | API·비즈니스 로직 없음 |
| **prop** | Component Property | React props | `variant`, `size`, `disabled` |
| **children** | Slot 콘텐츠 | `{children}` | |
| **합성 (Composition)** | Instance 조합 | compound components | Card + CardHeader + CardBody |
| **스토리 (Story)** | Usage 프레임 | `*.stories.tsx` | Storybook 단위 |
| **Storybook** | — | 컴포넌트 카탈로그 | Figma Usage와 1:1 대응 목표 |
| **핸드오프 (Handoff)** | Figma 링크 + 체크리스트 | PR, 구현 | 디자인 → UI 전달 |
| **manifest** | — | `figma.manifest.json` | Figma 노드 ↔ 코드 파일 SSOT |
| **node-id** | Figma URL 파라미터 | `"1692:74"` | URL `1692-1347` → `1692:1347` |
| **싱크 (Sync)** | Figma 변경 | figma-sync PR | manifest 등록 컴포넌트만 자동 |
| **Diff** | — | 변경분 추출 | 싱크 파이프라인 단계 |

---

## 6. 협업 · 프로세스

| 공식 용어 | 설명 | 비고 |
|----------|------|------|
| **게이트 (Gate)** | 다음 단계 진행 전 확인 조건 | 토큰 → 컴포넌트 → 스토리 → 코드 |
| **체크리스트** | 핸드오프·완료 기준 목록 | 운영 가이드 §8 참고 |
| **SSOT** | Single Source of Truth | manifest = Figma↔코드 단일 기준 |
| **코멘트 기록** | Figma 코멘트 | ❌ 구두(口頭)만으로 스펙 변경 |
| **영향 범위** | 변경이 미치는 레이어·화면 | 토큰 변경 = 전체 UI 영향 가능 |

---

## 7. 내부 · 예외 명명

| 공식 용어 | Figma | 코드 | 비고 |
|----------|-------|------|------|
| **내부 컴포넌트** | `.DesignSystemHeader` | `_` 또는 미 export | 점(`.`) 접두사 = 외부 사용 금지 |
| **Dev Mode** | Figma Dev Mode | — | MCP·Inspect 핸드오프 |
| **MCP** | Figma MCP Server | Cursor 연동 | 디자인 컨텍스트 읽기 |

---

## 8. 금지 · deprecated 용어

아래는 **새 문서·Figma·코드·슬랙**에서 사용하지 않습니다.

| ❌ 사용 중단 | ✅ 대체 용어 | 이유 |
|------------|------------|------|
| Styles (페이지명) | Foundation / 토큰 | FSD·코드와 불일치 |
| Utilities (Figma 페이지) | Components | FSD `lib/hooks`와 혼동 |
| Type (property) | Variant | 코드 `variant` prop과 통일 |
| Pressed | Active (State) | CSS `:active`와 정합 |
| IsEmpty | Empty | Boolean 명명 통일 |
| Highlight (boolean) | State=Highlighted | State 속성으로 통합 |
| Dark Mode Preview | Usage / 스토리 | Definition과 예시 분리 |
| slot-autocomplete-items | Slot / Items | 슬롯 명명 규칙 |
| Item01, Item02 … | Autocomplete Item (인스턴스) | 의미 없는 순번 제거 |
| AutoCompleteItem | Autocomplete Item | 부모 컴포넌트명 일관성 |
| hex 직접 전달 | 토큰 이름 | e.g. `color/primary/500` |
| PNG 아이콘 | SVG + currentColor | 핸드오프 규칙 |

---

## 9. 자주 헷갈리는 쌍

### shared vs features

| 구분 | shared | features |
|------|--------|----------|
| **정의** | 재사용 UI 부품 | 사용자 행동 + 로직 |
| **예시** | `Button`, `Dialog`, `Card` | `AddToCart`, `LoginForm` |
| **Figma** | BO UI Kit | 앱 Figma > Features |
| **로직** | 없음 | API, 상태, hooks 있음 |

### Select vs Dropdown

| 용어 | 공식 정의 | 비고 |
|------|----------|------|
| **Select** | 폼 필드형 선택 UI | manifest 등록 |
| **Dropdown** | 메뉴·액션 목록 UI | Select와 역할 구분 README에 명시 |

### Autocomplete vs Combobox

| 용어 | 공식 정의 | 비고 |
|------|----------|------|
| **Autocomplete** | 입력 + 추천 목록 | `Autocomplete Item` 하위 컴포넌트 |
| **Combobox** | 선택 + 검색 복합 | Autocomplete와 차이 README에 명시 |

### entities vs features

| 용어 | 공식 정의 | 예시 |
|------|----------|------|
| **entities** | 도메인 **데이터** 표현 | ProductCard, UserAvatar |
| **features** | 도메인 **행동** | AddToCart, FollowUser |

### widgets vs features

| 용어 | 공식 정의 | 예시 |
|------|----------|------|
| **widgets** | 큰 UI **섹션** (조립) | AppHeader, CommentSection |
| **features** | 사용자 **기능** (행동) | SearchFilter, NotificationBell |

---

## 10. 소통 예시 (올바른 말하기)

```
✅ "Button 컴포넌트 Outline variant, disabled 상태 싱크 맞춰주세요."
✅ "Badge color 토큰 destructive 값이 바뀌었어요."
✅ "Autocomplete icon 슬롯 추가됐는데 스토리도 업데이트 필요해요."
✅ "Field 컴포넌트를 Utilities에서 Components로 옮겼어요."
✅ "Segmented Control manifest 노드 9705:88227 연결해주세요."

❌ "버튼 타입 아웃라인으로 바꿔주세요."        → variant 사용
❌ "스타일 페이지 색상 수정했어요."            → Foundation / 토큰
❌ "유틸리티에 있는 폼 컴포넌트요."            → Components / shared
❌ "눌린 상태랑 호버 상태 추가해주세요."       → Active, Hover (State)
```

---

## 11. 용어 색인 (가나다·알파벳)

| 키워드 | 공식 용어 | 섹션 |
|--------|----------|------|
| Active | State | §4 |
| app | 레이어 | §1 |
| Autocomplete | 컴포넌트 | §9 |
| BO UI Kit | UI Kit / Shared | §2 |
| Component Set | 컴포넌트 | §4 |
| Composite | Composite 컴포넌트 | §2 |
| Definition | Definition | §2 |
| Dev Mode | Dev Mode | §7 |
| Dropdown | Select와 구분 | §9 |
| entities | 레이어 | §1 |
| features | 레이어 | §1 |
| Foundation | Foundation | §2 |
| FSD | FSD | §1 |
| Handoff | 핸드오프 | §5 |
| Instance | 인스턴스 | §4 |
| manifest | manifest | §5 |
| pages | 레이어 | §1 |
| Public API | Public API | §1 |
| shared | 레이어 / UI Kit | §1, §2 |
| Slice | 슬라이스 | §1 |
| Slot | 슬롯 | §4 |
| SSOT | SSOT | §6 |
| State | 상태 | §4 |
| Story | 스토리 | §2, §5 |
| Sync | 싱크 | §5 |
| Token | 토큰 | §3 |
| Usage | Usage (Stories) | §2 |
| Variant | Variant / 변형 | §4 |
| widgets | 레이어 | §1 |

---

*용어 추가·변경 시 이 문서를 먼저 갱신하고, 개요·운영 가이드에 반영해주세요.*
