# figma-to-react — Figma → React 디자인 시스템 규칙

로컬 Figma 데스크톱 MCP("BO UI Kit", shadcn/ui 계열)를 React 컴포넌트로 변환하는 워크스페이스.
이 파일은 `figma-create-design-system-rules` 스킬의 공식 템플릿 구조를 따른다.
모든 Figma 기반 작업에 적용된다.

> ★ **이 파일이 모든 코딩 규칙의 단일 소스(single source of truth)다.** 협업자는 서로 다른
> AI 에디터(Claude Code, Cursor 등)를 쓰므로, **버그를 고친 뒤 일반화한 재발 방지 규칙은
> 반드시 여기 `CLAUDE.md` 에 적는다.** 에디터별 개인 메모리(Claude 자동 메모리, Cursor
> Memories)에만 적으면 다른 에디터를 쓰는 협업자가 공유받지 못한다. Cursor 는
> `.cursor/rules/project.mdc` 를 통해, 기타 에이전트는 `AGENTS.md` 를 통해 이 파일을 읽는다.

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

## Figma 추출 규칙 (REST — 수동·자동 동일 경로)

IMPORTANT: **추출은 Figma REST API 를 정식 경로로 한다.** 자동 sync(GitHub Action)는 헤드리스라
MCP 가 없어 REST 를 쓰고(`figma-sync.yml` `--allowedTools` 에 MCP 없음), **수동 작업도 REST 로 맞춘다.**
REST 와 Figma MCP 는 **같은 Figma 파일을 읽어 값이 동일**하므로(예: 그림자 추출 시 둘 다 border 8%·
Dialog 그림자 없음으로 동일하게 나옴), 도구를 통일해도 결과 정합성이 보장된다. 인증: `FIGMA_TOKEN`(.env / CI Secret).
복잡한 컴포넌트라도 REST 응답에 전체 노드 트리(중첩/auto-layout/variant/effect)가 다 들어있다 —
"MCP 만 주는 디자인 값" 은 없다.

### ★ 릴리즈 신호 = 발행(publish), 저장이 아니다

- 파이프라인은 **이름 붙은 Figma 버전**만 릴리즈로 취급한다. 디자이너가 라이브러리를
  publish 하면 Figma 가 `Components published` 라벨을 자동으로 붙인다(사람이 직접 이름을
  붙여도 동일). **무명 autosave 는 작업 중 상태이므로 무시**한다.
- 덕분에 디자이너는 자유롭게 저장하며 실험하고, **publish 를 누른 순간에만** 코드에 반영된다
  → 소비처 입장의 "예고 없는 시각 변경" 이 사라지고, autosave 노이즈도 원천 차단된다.
- 판정: `scripts/check-figma-version.mjs` 가 `/versions` 에서 **라벨 있는 최신 버전**을 찾아
  매니페스트 `lastSyncedVersion`/`lastSyncedAt` 과 비교한다(id 가 다르면서 **더 최신**일 때만
  변경 — 오래된 발행본으로 되돌아가는 역행 sync 방지). 종전 "저장 기준" 동작은 `--any` 로 남겨둠.
- IMPORTANT: 추출·지문 조회는 **발행 시점 스냅샷으로 고정**한다 — 모든 노드/이미지 요청에
  `&version=<발행 version>` 을 붙인다. 붙이지 않으면 발행 이후의 미발행 작업분이 섞인다.

### Required Flow (생략 금지)

1. `figma.manifest.json` 에서 fileKey 와 노드 id 를 확보하고, `npm run check:figma` 의
   `currentVersion`(= 발행 version, 이하 `PUB`)을 확보한다.
2. `GET /v1/files/:key/nodes?ids=<nodeId>&version=<PUB>` 로 **해당 노드만** 가져온다
   (무거운 전체 파일 GET 금지, `version` 생략 금지).
   fills / strokes / effects / cornerRadius / layout(padding·spacing) / `boundVariables` 를 코드와 대조한다.
3. **토큰 바인딩은 "값 기준"으로 매핑한다.** REST 는 `boundVariables` 에 변수 **ID + 실제 값**만 주고
   변수 *이름* 은 직접 주지 않는다(이름은 Enterprise 변수 API 필요). 그러므로 노드의 fill/stroke 값을
   코드 토큰(`--accent` 등) 값과 대조해 매핑한다. ★ **Figma 에 없는 새 토큰을 발명하지 말 것** — 색이
   바뀌면 기존 토큰 값을 바꾸거나 재바인딩한다.
4. ★ **`GET /v1/images?ids=<nodeId>` 로 렌더 이미지를 받아 코드 렌더와 눈으로 1:1 대조**한다(특히
   복잡한 구조·variant — raw JSON 만으론 놓치기 쉽다). 이 시각 대조가 REST raw 의 안전장치다.
5. 이 프로젝트 컨벤션(토큰/cva/cn)으로 구현한다. (Figma codegen 출력은 디자인/동작의 표현일 뿐 최종 스타일 아님.)
6. 완료 전 Figma 와 1:1 시각·동작 검증.

> 보조 도구: 원격 Figma MCP(`plugin_figma` — `get_variable_defs`/`get_design_context`, fileKey+nodeId)도
> 사용 가능하며 **같은 값**을 준다(변수 *이름* 까지 줘서 사람 작업엔 더 편함). 단 CI 는 OAuth 인증·무거운
> 페이로드·Dev 시트 의존 때문에 붙이지 않는다 → **일관성을 위해 수동도 REST 가 기본**, 복잡한 구조 이해가
> 필요할 때만 MCP 를 보조로 쓴다. 로컬 데스크톱 MCP(`figma-local`)는 Dev Mode 권한으로 막혀 있어 안 쓴다.

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

### npm 타입 배포 (d.ts) — 재발 방지

- IMPORTANT: `type:"module"` 패키지의 d.ts 는 ESM 취급이다. `exports` 의 `require` 쪽에는
  반드시 **별도의 `.d.cts` 타입**을 조건부(`"require": { "types": ... }`)로 연결한다 —
  ESM d.ts 하나만 두면 node16 CJS TS 소비자에서 "Masquerading as ESM" 이 난다.
- IMPORTANT: 배포되는 d.ts 안의 상대 import 는 **명시적 확장자**(`./button.js` / `.cjs`)여야
  한다. tsc 는 소스의 확장자 없는 import 를 그대로 emit 하므로 `scripts/build-lib.mjs` 의
  후처리 단계가 재작성한다 — 빌드 파이프라인을 바꿀 때 이 단계를 없애지 말 것.
- 타입/exports 를 건드리면 `npx @arethetypeswrong/cli --pack . --exclude-entrypoints ./styles.css`
  로 node10/node16(ESM·CJS)/bundler 전부 🟢 인지 확인한다(smoke CI 에도 포함됨).
- `exports` 에는 `"./package.json": "./package.json"` 서브패스를 유지한다(번들러·툴체인이 요구).

### 접근성

- 인터랙티브 요소는 네이티브 요소를 기반으로 하고(예: 숨긴 `<input>`), 포커스 링(`focus-visible:ring`) 과 `aria-*` 를 갖춘다.

### 다크 모드 — ⚠️ 현재 토큰은 Figma 와 다르다(미추출 상태)

- `.dark` 클래스로 토큰을 전환한다(상단 바 토글).
- **Figma 에는 다크 디자인이 실재한다.** 각 컴포넌트 페이지 안에 `Dark Mode Preview`
  **프레임**이 하나씩 있다(페이지가 아니라 프레임 — 예: Button 페이지 `1606:9458` →
  `7968:4819`, Input `5651:4474` → `7968:8582`, Dialog `5651:4432` → `7968:7276`).
  확인한 컴포넌트 전부에 존재한다.
- **그런데 `src/tokens.css` 의 `.dark` 값은 여기서 추출한 게 아니다** — 초기 커밋 때 손으로
  넣은 근사값이고, 이후 sync 가 갱신한 적이 없다. 실측 차이:
  | | Figma 다크 프레임 | 현재 `.dark` |
  |---|---|---|
  | 배경 | `#141414` (중성 그레이) | `#020618` (남색 계열) |
  | 카드/헤더 | `#101012` | `#0f172b` |
  | Secondary 채움 | `#262626` | `#1e293b` |
- 다크를 실제로 지원하려면 위 프레임들을 **추적 노드로 등록해 라이트와 같은 방식으로 추출**해야
  한다(값 기준 매핑). 그 전까지 다크는 **미검증**이며, 소비처에 다크 지원을 약속하지 말 것.
- 참고: 라이트/다크가 Figma 변수의 **모드(mode)** 로 되어 있어도 REST `boundVariables` 는
  기본 모드 값만 준다. 모드별 값을 읽는 `/v1/files/:key/variables/local` 은
  `file_variables:read` 스코프(Enterprise 플랜)가 필요해 현재 403 이다. → **프레임 추출이
  플랜 무관한 유일한 경로다.**

---

> 참고: Figma 공식 `create_design_system_rules` MCP 도구는 로컬 데스크톱 서버에 노출돼 있지 않아,
> 스킬에 포함된 공식 템플릿 구조를 기준으로 이 파일을 작성했다. 원격 Figma MCP 연결 시 그 도구로 추가 보강 가능.
