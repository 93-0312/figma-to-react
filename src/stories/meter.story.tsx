import { Meter } from "../components/ui/meter";
import type { Story } from "../playground/types";

export const meterStory: Story = {
  name: "Meter",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7664-31",
  controls: [
    { type: "text", name: "value", label: "value (0~100)", default: "50" },
    { type: "text", name: "label", label: "label", default: "Label" },
    { type: "text", name: "valueLabel", label: "valueLabel (빈칸=자동 %)", default: "" },
    { type: "boolean", name: "showLabels", label: "showLabels", default: true },
    {
      type: "boolean",
      name: "showSecondaryLabel",
      label: "showSecondaryLabel",
      default: true,
    },
  ],
  render: (args) => {
    const v = Number(args.value);
    const vl = String(args.valueLabel);
    return (
      <div className="w-[256px]">
        <Meter
          value={Number.isFinite(v) ? v : 0}
          label={String(args.label)}
          valueLabel={vl === "" ? undefined : vl}
          showLabels={Boolean(args.showLabels)}
          showSecondaryLabel={Boolean(args.showSecondaryLabel)}
        />
      </div>
    );
  },
  gallery: <MeterGallery />,
};

function MeterGallery() {
  return (
    <div className="flex max-w-[256px] flex-col gap-6">
      <Meter value={0} label="0%" />
      <Meter value={25} label="Storage" valueLabel="25%" />
      <Meter value={50} label="Label" />
      <Meter value={75} label="CPU" valueLabel="75%" />
      <Meter value={100} label="Full" />
      <Meter value={60} label="라벨 없음" showLabels={false} />
      <Meter value={40} label="보조 없음" showSecondaryLabel={false} />
    </div>
  );
}
