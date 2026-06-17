# figma-to-react — Figma → React 디자인 시스템 규칙

로컬 Figma 데스크톱 MCP("BO UI Kit", shadcn/ui 계열)를 React 컴포넌트로 변환하는 워크스페이스.
이 파일은 `figma-create-design-system-rules` 스킬의 공식 템플릿 구조를 따른다.
모든 Figma 기반 작업에 적용된다.

## 프로젝트 스택

- Vite + React 18 + TypeScript + Tailwind v3 + class-variance-authority(cva) + tailwind-merge
- 상태관리/라우팅 없음(컴포넌트 카탈로그 성격). 경로 별칭 없음 — **상대 경로 import** 사용.

## General Component Rules

- IMPORTANT: 새 UI 컴포넌트는 `src/components/ui/` 에 둔다. 기존 컴포넌트가 있으면 새로 만들지 말고 재사용/확장한다.
- 파일명은 kebab-case(`button.tsx`, `checkbox.tsx`), 컴포넌트명은 PascalCase, `forwardRef` 로 작성.
- 배럴 파일 `src/components/ui/index.ts` 에 export 를 추가한다.
- 모든 컴포넌트는 `className` prop 을 받아 `cn()`(`src/lib/utils.ts`) 으로 병합해 합성 가능해야 한다.
- variant 스타일은 `cva` 로 정의하고, prop 타입은 `VariantProps<typeof xVariants>` 로 파생한다.
- exported 컴포넌트에는 JSDoc(역할, Figma node id, props) 을 단다.

## Styling Rules

- Use Tailwind utility classes. 인라인 스타일은 동적 값에만 한정.
- IMPORTANT: 색상·간격·radius·타이포·shadow 를 **하드코딩하지 말 것** — 항상 토큰을 쓴다.
  - 색상 토큰: `src/index.css` 의 RGB 채널 CSS 변수(`--primary` 등). Tailwind 에서 `bg-primary`, `text-foreground`, `border-input` …
    불투명도 유틸(`bg-primary/90`) 지원을 위해 `tailwind.config.js` 에서 `rgb(var(--x) / <alpha-value>)` 형식으로 노출.
  - radius: `rounded-radius`(10) · `rounded-radius-sm`(4) · `rounded-radius-lg`(8) · `rounded-radius-xl`(12)
  - 폰트: Pretendard, `text-xs/sm/base` (Figma 토큰값으로 lineHeight/letterSpacing 커스터마이즈됨)
  - shadow: `shadow-xs`(tailwind-shadow/xs) · `shadow-btn`(채워진 버튼용 drop+inner)
- 새 토큰이 필요하면 `src/index.css`(:root + .dark) 와 `tailwind.config.js` **양쪽**에 추가한다.
- 테마 커스터마이징은 `tailwind.config.js`.

## Figma MCP Integration Rules

매 Figma 기반 변경마다 아래 흐름을 따른다.

### Required Flow (생략 금지)

1. `get_metadata` 로 노드/변형(variant) 구조를 파악하고 구현할 정확한 노드 id 를 확보한다.
2. `get_design_context` 로 구조·참조 코드를 가져온다. 응답이 너무 크면 metadata 로 좁힌 뒤 필요한 노드만 다시 가져온다.
3. `get_variable_defs` 로 그 노드에 바인딩된 토큰값(색상/간격/radius/타이포)을 추출한다.
4. `get_screenshot` 으로 구현할 변형의 시각 레퍼런스를 확보한다.
5. 위를 모두 확보한 뒤 구현한다. Figma MCP 의 React+Tailwind 출력은 **디자인/동작의 표현**이지 최종 코드 스타일이 아니다 — 이 프로젝트 컨벤션(토큰/cva/cn)으로 번역한다.
6. 완료 전 Figma 와 1:1 시각·동작 검증.

### Validation

- `.claude/launch.json` 의 `figma-to-react` 서버를 preview_start 로 띄우고 `preview_inspect` 로 computed style 을 토큰값과 대조한다.
- screenshot 툴이 종종 타임아웃나므로 `preview_inspect`/`preview_eval` 을 1차 검증 수단으로 쓴다.
- 주의: `transition-colors` 가 걸린 요소를 JS 합성 클릭으로 토글한 직후 getComputedStyle 은 전이값이 고착돼 보일 수 있다 — 새로 마운트된 요소(갤러리)로 검증하거나 클린 리로드 후 확인한다.

## Asset Handling

- IMPORTANT: Figma MCP 가 localhost 소스(이미지/SVG)를 주면 그 소스를 그대로 사용한다. 플레이스홀더를 만들지 않는다.
- IMPORTANT: 새 아이콘 패키지를 설치하지 않는다 — 에셋은 Figma payload 에서 가져온다.
- 예외: 체크/화살표 같은 단순 도형은 localhost 의존을 피하기 위해 인라인 SVG(currentColor) 로 직접 그려도 된다.

## Git/PR 텍스트 규칙 (외부 멘션·알림 방지)

- IMPORTANT: PR 제목·본문, 커밋 메시지, 이슈·코멘트에 **백틱 없는 `@<이름>` 을 쓰지 말 것.**
  GitHub 이 이를 **@멘션으로 자동 해석**해 해당 계정에 알림 메일을 보낸다. 특히 npm 스코프
  `@eromnet` 은 GitHub 사용자 `eromnet`(알림 주소 = **개발팀 전체가 참조되는 it@eromnet.com**)과
  이름이 같아, 산문에 그대로 쓰면 팀 전체에 메일이 발송된다. **실제 사고: PR #85.**
- 스코프/패키지명을 언급할 땐 **백틱으로 감싼다**(예: `` `@eromnet/bo-ui-kit` ``) — 코드 스팬은
  멘션으로 해석되지 않는다. 커밋 메시지처럼 백틱이 안 통하는 곳은 `@` 를 빼고 "eromnet 스코프" 로 적는다.
- 일반 규칙: it@eromnet.com 으로 **메일/외부 연락을 보내거나 트리거하지 말 것**(멘션·알림 포함).
- 강제: 로컬 `commit-msg` 훅(`.githooks/commit-msg`)이 바른 `@eromnet` 멘션이 든 커밋을 거부한다.
  새 클론에서 활성화: `git config core.hooksPath .githooks`. (CI/헤드리스 커밋엔 적용 안 되므로 위 규칙 준수로 보완.)

## Project-Specific Conventions

### ★ Variant 속성 매핑 (가장 중요 — 과거 버그 재발 방지)

Figma 컴포넌트의 variant 속성을 코드 prop 으로 옮길 때 반드시 지킨다.

- IMPORTANT: Figma variant 속성(예: `IsSelected`, `IsParent`, `Disabled`, `Mobile`)을 **그대로 1:1 prop 으로 매핑**한다. 여러 속성을 성급히 하나의 union/플래그로 **평탄화(flatten)하지 말 것**.
- IMPORTANT: 속성이 N개면 **2^N 조합 전체를 매트릭스로 확인**한다. 특히 비직관적인 "엣지 조합"(예: `IsSelected=False & IsParent=True`)을 `get_screenshot`/`get_design_context` 로 **반드시** 확인한다. 해피패스만 보면 속성 간 상호작용/우선순위를 놓친다.
- IMPORTANT: 속성 간 게이팅/우선순위는 **Figma 의 조건식이 진실의 원천**이다. `get_design_context` 의 `isSelected && !isParent` 같은 조건을 그대로 따르고, 웹 일반 상식(예: "HTML indeterminate 는 checked 와 독립")을 가정하지 않는다.
  - 실제 사례: Checkbox `.Selector` 는 `IsSelected` 가 마스터 게이트 → `checked=false` 면 `indeterminate` 와 무관하게 빈 박스, minus 는 `checked && indeterminate` 일 때만 표시.
- 각 컴포넌트에 **상태 진리표(truth table)를 JSDoc 주석**으로 남긴다(조합 → 렌더 결과).
- prop 이름은 가능한 한 Figma variant 이름과 일치시켜 의미(semantic)를 보존한다.

### 스토리/카탈로그

- 새 컴포넌트를 만들면 `src/stories/<name>.story.tsx` 에 `Story`(컨트롤 + render + 전체 변형 갤러리)를 정의하고 `src/App.tsx` 의 `STORIES` 에 등록한다.
- 갤러리에는 **모든 조합(엣지 포함)을 렌더**해 시각 회귀를 확인할 수 있게 한다.

### 접근성

- 인터랙티브 요소는 네이티브 요소를 기반으로 하고(예: 숨긴 `<input>`), 포커스 링(`focus-visible:ring`) 과 `aria-*` 를 갖춘다.

### 다크 모드

- `.dark` 클래스로 토큰을 전환한다(상단 바 토글). 현재 다크 토큰은 근사값이므로 정밀 작업 시 Figma "Dark Mode Preview" 에서 재추출한다.

---

> 참고: Figma 공식 `create_design_system_rules` MCP 도구는 로컬 데스크톱 서버에 노출돼 있지 않아,
> 스킬에 포함된 공식 템플릿 구조를 기준으로 이 파일을 작성했다. 원격 Figma MCP 연결 시 그 도구로 추가 보강 가능.
