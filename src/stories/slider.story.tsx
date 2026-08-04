import { Slider } from "../components/ui/slider";
import type { Story } from "../playground/types";

/** Figma .SliderBar `Percentage` variant 표본(0~100, 10 단위) */
const PERCENTAGES = ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"];

export const sliderStory: Story = {
  name: "Slider",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7706-12",
  controls: [
    { type: "select", name: "value", label: "value (%)", options: PERCENTAGES, default: "50" },
    { type: "boolean", name: "labelTop", label: "LabelTop", default: true },
    { type: "boolean", name: "showLabelRow", label: "ShowLabelRow", default: true },
    { type: "text", name: "label", label: "label", default: "Label" },
    { type: "boolean", name: "disabled", label: "disabled", default: false },
  ],
  render: (args, setArg) => (
    <div className="w-[256px]">
      <Slider
        value={Number(args.value ?? "50")}
        onValueChange={(v) => setArg("value", String(Math.round(v / 10) * 10))}
        labelTop={Boolean(args.labelTop)}
        showLabelRow={Boolean(args.showLabelRow)}
        label={String(args.label)}
        disabled={Boolean(args.disabled)}
        step={10}
      />
    </div>
  ),
  gallery: <SliderGallery />,
};

function SliderGallery() {
  return (
    <div className="flex flex-col gap-8">
      {/* Slider 세트: LabelTop × ShowLabelRow 2^2 매트릭스 */}
      <div className="flex flex-col gap-4">
        <span className="text-xs text-muted-foreground">
          LabelTop × ShowLabelRow (Figma Slider 세트)
        </span>
        <div className="grid max-w-[560px] grid-cols-2 gap-6">
          {([
            { label: "LabelTop=True · ShowLabelRow=True", props: { labelTop: true, showLabelRow: true } },
            { label: "LabelTop=False · ShowLabelRow=True", props: { labelTop: false, showLabelRow: true } },
            { label: "LabelTop=True · ShowLabelRow=False", props: { labelTop: true, showLabelRow: false } },
            { label: "LabelTop=False · ShowLabelRow=False", props: { labelTop: false, showLabelRow: false } },
          ] as const).map((s) => (
            <div key={s.label} className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <Slider defaultValue={50} valueLabel="X%" {...s.props} />
            </div>
          ))}
        </div>
      </div>
      {/* .SliderBar Percentage 0~100 전체 variant */}
      <div className="flex max-w-[280px] flex-col gap-3">
        <span className="text-xs text-muted-foreground">.SliderBar Percentage 0–100</span>
        {PERCENTAGES.map((p) => (
          <Slider key={p} defaultValue={Number(p)} showLabelRow={false} aria-label={`${p}%`} />
        ))}
      </div>
      {/* disabled — Figma 미정의(디자인 시스템 관례 opacity 64%) */}
      <div className="flex max-w-[280px] flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">Disabled (Figma 미정의 — 관례)</span>
        <Slider defaultValue={30} disabled />
      </div>
    </div>
  );
}
