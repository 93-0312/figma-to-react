import { DatePicker } from "../components/ui/date-picker";
import type { Story } from "../playground/types";

// Figma 기준 장면: 트리거 "February 18th, 2026", 팝업은 2026-03 뷰
const FIGMA_DATE = new Date(2026, 1, 18);

export const datePickerStory: Story = {
  name: "DatePicker",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7954-7493",
  controls: [
    { type: "boolean", name: "withPresets", label: "WithPresets", default: true },
    { type: "text", name: "placeholder", label: "placeholder", default: "Pick a date" },
    { type: "boolean", name: "invalid", label: "invalid (error)", default: false },
    { type: "boolean", name: "disabled", label: "disabled", default: false },
  ],
  render: (args) => (
    <div className="flex h-[420px] w-[420px] justify-center pt-2">
      <div className="w-[240px]">
        <DatePicker
          defaultValue={FIGMA_DATE}
          today={FIGMA_DATE}
          withPresets={Boolean(args.withPresets)}
          placeholder={String(args.placeholder)}
          invalid={Boolean(args.invalid)}
          disabled={Boolean(args.disabled)}
        />
      </div>
    </div>
  ),
  gallery: <DatePickerGallery />,
};

function DatePickerGallery() {
  return (
    <div className="flex flex-col gap-6">
      {([
        { label: "Default (값 있음)", props: { defaultValue: FIGMA_DATE } },
        { label: "Placeholder (값 없음)", props: {} },
        { label: "Invalid", props: { defaultValue: FIGMA_DATE, invalid: true } },
        { label: "Disabled", props: { defaultValue: FIGMA_DATE, disabled: true } },
      ] as const).map((s) => (
        <div key={s.label} className="flex w-[240px] flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">{s.label}</span>
          <DatePicker today={FIGMA_DATE} {...s.props} />
        </div>
      ))}
      {/* 열린 상태(Figma 기준 장면) — defaultOpen, 팝업 공간 확보 */}
      <div className="flex h-[420px] w-[420px] flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">Open (Figma 7954:7493 장면)</span>
        <div className="w-[240px]">
          <DatePicker defaultValue={FIGMA_DATE} today={FIGMA_DATE} defaultOpen />
        </div>
      </div>
    </div>
  );
}
