import type * as React from "react";
import {
  InputOTP,
  InputOTPSlot,
  InputOTPSeparator,
} from "../components/ui/input-otp";
import type { Story } from "../playground/types";

/** 6자리(3-3) 슬롯 묶음 — slot1="2", slot2 active, 나머지 빈칸 (Figma 기본 상태). */
function DefaultSlots() {
  return (
    <>
      <InputOTPSlot char="2" />
      <InputOTPSlot active />
      <InputOTPSlot />
      <InputOTPSeparator />
      <InputOTPSlot />
      <InputOTPSlot />
      <InputOTPSlot />
    </>
  );
}

/** 6자리 전부 채운 묶음 */
function FilledSlots() {
  return (
    <>
      <InputOTPSlot char="2" />
      <InputOTPSlot char="4" />
      <InputOTPSlot char="8" />
      <InputOTPSeparator />
      <InputOTPSlot char="1" />
      <InputOTPSlot char="5" />
      <InputOTPSlot char="9" />
    </>
  );
}

export const inputOtpStory: Story = {
  name: "Input OTP",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=8060-1580",
  controls: [
    { type: "boolean", name: "isLarge", label: "isLarge (36px)", default: false },
    { type: "boolean", name: "showTitle", label: "showTitle", default: true },
    { type: "text", name: "title", label: "title", default: "Verification code" },
    { type: "boolean", name: "showBelowText", label: "showBelowText", default: true },
    {
      type: "text",
      name: "belowText",
      label: "belowText",
      default: "Enter the 6-digit code sent to your email.",
    },
  ],
  render: (args) => (
    <InputOTP
      isLarge={Boolean(args.isLarge)}
      showTitle={Boolean(args.showTitle)}
      title={String(args.title)}
      showBelowText={Boolean(args.showBelowText)}
      belowText={String(args.belowText)}
    >
      <DefaultSlots />
    </InputOTP>
  ),
  gallery: <InputOtpGallery />,
};

function InputOtpGallery() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <Cell label="Small (32px) · 입력 중">
        <InputOTP>
          <DefaultSlots />
        </InputOTP>
      </Cell>

      <Cell label="Large (36px) · 입력 중">
        <InputOTP isLarge>
          <DefaultSlots />
        </InputOTP>
      </Cell>

      <Cell label="Small · 전부 채움">
        <InputOTP showTitle={false} showBelowText={false}>
          <FilledSlots />
        </InputOTP>
      </Cell>

      <Cell label="Large · 전부 채움">
        <InputOTP isLarge showTitle={false} showBelowText={false}>
          <FilledSlots />
        </InputOTP>
      </Cell>
    </div>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}
