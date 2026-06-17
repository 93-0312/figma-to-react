// 외부 프로젝트가 라이브러리를 쓰는 그대로: 패키지에서 import + styles.css 한 줄.
// (Tailwind 미사용 프로젝트 — styles.css 만으로 토큰/유틸이 모두 적용된다)
import {
  Button,
  Meter,
  InputOTP,
  InputOTPSlot,
  InputOTPSeparator,
  Field,
  Input,
  Checkbox,
  Label,
} from "bo-ui-kit";
import "bo-ui-kit/styles.css";

export default function App() {
  return (
    <div
      style={{
        padding: 24,
        display: "grid",
        gap: 20,
        maxWidth: 380,
        fontFamily: "Pretendard, system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 18, fontWeight: 600 }}>bo-ui-kit · consumer</h1>

      <div data-test="buttons" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Button>Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
      </div>

      <Meter value={70} label="Storage" valueLabel="70%" />

      <Field label="Email" required>
        <Input placeholder="you@example.com" />
      </Field>

      <InputOTP isLarge>
        <InputOTPSlot char="2" />
        <InputOTPSlot active />
        <InputOTPSlot />
        <InputOTPSeparator />
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTP>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Checkbox id="agree" />
        <Label htmlFor="agree">동의합니다</Label>
      </div>
    </div>
  );
}
