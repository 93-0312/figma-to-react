import { SegmentedControl } from "../components/ui/segmented-control";
import type { SegmentedControlProps } from "../components/ui/segmented-control";
import type { Story } from "../playground/types";

const STYLES: NonNullable<SegmentedControlProps["segStyle"]>[] = ["rounded", "regular", "sharp"];
const OPTS = [
  { value: "day", label: "일" },
  { value: "week", label: "주" },
  { value: "month", label: "월" },
];

export const segmentedControlStory: Story = {
  name: "Segmented Control",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=9705-88227",
  controls: [
    { type: "select", name: "segStyle", label: "style", options: STYLES, default: "rounded" },
  ],
  render: (args, setArg) => (
    <div className="w-[300px]">
      <SegmentedControl
        options={OPTS}
        segStyle={args.segStyle as SegmentedControlProps["segStyle"]}
        value={String(args.value ?? "day")}
        onValueChange={(v) => setArg("value", v)}
      />
    </div>
  ),
  gallery: (
    <div className="flex w-[300px] flex-col gap-4">
      {STYLES.map((s) => (
        <div key={s} className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{s}</span>
          <SegmentedControl options={OPTS} segStyle={s} defaultValue="week" />
        </div>
      ))}
    </div>
  ),
};
