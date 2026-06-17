// 심볼릭 링크 없이, npm pack 으로 만든 실제 배포 tarball 만 설치된 패키지를 import.
import { Button, Meter, InputOTP, InputOTPSlot, InputOTPSeparator, Field, Input } from "bo-ui-kit";
import "bo-ui-kit/styles.css";

export default function App() {
  return (
    <div style={{ padding: 24, display: "grid", gap: 20, maxWidth: 380, fontFamily: "Pretendard, system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 18, fontWeight: 600 }}>bo-ui-kit · pack(tarball) consumer</h1>
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
    </div>
  );
}
