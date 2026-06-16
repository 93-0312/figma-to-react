# @eromnet/bo-ui-kit

Figma "BO UI Kit" 디자인 시스템에서 추출한 React 컴포넌트 라이브러리.
Button, Checkbox, Input, Label, Field, Input OTP, Meter 등 — Tailwind 토큰 기반.

## 설치

```bash
npm i @eromnet/bo-ui-kit
```

peer: `react`, `react-dom` (>=18).

## 사용

```tsx
import { Button, Meter } from "@eromnet/bo-ui-kit";
// 스타일(토큰 + 컴포넌트 유틸)을 앱 진입점에서 한 번 import
import "@eromnet/bo-ui-kit/styles.css";

export default function App() {
  return (
    <div>
      <Button>저장</Button>
      <Meter value={70} label="Storage" />
    </div>
  );
}
```

- **ESM·CommonJS 모두 지원**합니다. `import` 뿐 아니라 `const { Button } = require("@eromnet/bo-ui-kit")` 도 동작합니다(dual 빌드: `index.js`/`index.cjs`).
- **Tailwind 없이도 동작**합니다. `styles.css` 한 줄이면 토큰과 컴포넌트가 쓰는 유틸리티가 모두 포함됩니다.
- **다크 모드**: 상위 요소에 `class="dark"` 를 주면 다크 토큰으로 전환됩니다.
- **테마 커스터마이징**: `styles.css` 의 CSS 변수(`--primary` 등)를 여러분의 CSS 에서 덮어쓰면 색을 바꿀 수 있습니다.
- **폰트**: 컴포넌트는 `Pretendard` 를 우선 사용하고 없으면 시스템 산세리프로 폴백합니다. 디자인 그대로 보려면 Pretendard 를 로드하세요.

## Tailwind 를 쓰는 프로젝트라면

`styles.css` 대신 토큰만 가져오고 유틸은 여러분의 Tailwind 가 생성하게 할 수도 있습니다(선택). 현재 0.1.0 은 프리빌드 `styles.css` 방식만 제공하며, Tailwind preset 동봉은 후속 추가 예정입니다.
