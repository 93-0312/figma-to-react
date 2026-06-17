# bo-ui-kit

Figma **"BO UI Kit"** 디자인 시스템에서 추출한 **React UI 컴포넌트 라이브러리**.
Tailwind 설정 없이 바로 쓰는 프리빌드 CSS · ESM·CJS 듀얼 번들 · 타입 포함.

```bash
npm i bo-ui-kit        # peer: react, react-dom >= 18
```

## 사용법

```tsx
import { Button, Field, Input } from "bo-ui-kit";
import "bo-ui-kit/styles.css";   // 디자인 토큰 + 컴포넌트 스타일 (앱 진입점에서 1회)

export default function App() {
  return (
    <Field label="이메일" required>
      <Input placeholder="you@example.com" />
    </Field>
  );
}
```

> `styles.css`는 앱에서 **한 번만** import 하면 됩니다. **Tailwind를 설치하거나 설정할 필요가 없습니다.**

## 특징

- **Tailwind 불필요** — `bo-ui-kit/styles.css` 한 줄에 디자인 토큰 + 컴포넌트 스타일이 모두 들어 있습니다. 전역 리셋(preflight)이 없어 기존 앱 스타일을 건드리지 않습니다.
- **ESM · CommonJS** — `import` / `require` 모두 지원.
- **TypeScript** — 타입 선언(`.d.ts`) 포함.
- **다크 모드** — 상위 요소에 `class="dark"`.
- **테마 변경** — `styles.css`의 CSS 변수(`--primary`, `--radius` 등)를 앱에서 덮어쓰면 색·반경 등이 바뀝니다.
- **폰트** — Pretendard 우선, 없으면 시스템 산세리프로 폴백.

## 컴포넌트

| 컴포넌트 | export |
|---|---|
| Button | `Button` |
| Checkbox | `Checkbox` |
| Input | `Input` |
| Label | `Label` |
| Field | `Field` |
| Input OTP | `InputOTP`, `InputOTPSlot`, `InputOTPSeparator` |
| Meter | `Meter` |
| Toggle | `Toggle` |
| Toggle Group | `ToggleGroup`, `ToggleGroupItem` |
| Select | `Select` |

모든 컴포넌트는 `className`으로 스타일 합성이 가능하고 `forwardRef`로 ref를 전달받습니다.

### 예시

```tsx
import { Toggle, ToggleGroup, ToggleGroupItem, Select } from "bo-ui-kit";

// 제어형 Toggle (2-state 버튼)
<Toggle pressed={on} onPressedChange={setOn}>굵게</Toggle>

// Select (드롭다운)
<Select
  options={[{ value: "apple", label: "Apple" }, { value: "banana", label: "Banana" }]}
  value={fruit}
  onValueChange={setFruit}
  placeholder="과일 선택…"
/>

// Toggle Group (세그먼티드, 단일 선택)
<ToggleGroup type="single" value={align} onValueChange={setAlign}>
  <ToggleGroupItem value="left">왼쪽</ToggleGroupItem>
  <ToggleGroupItem value="center">가운데</ToggleGroupItem>
  <ToggleGroupItem value="right">오른쪽</ToggleGroupItem>
</ToggleGroup>
```

## 요구사항

- **React 18+** — `react`, `react-dom`은 peer dependency.

## 라이선스

MIT © eromnet
