import { Progress } from "../components/ui/progress";
import type { Story } from "../playground/types";

export const progressStory: Story = {
  name: "Progress",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7673-96",
  controls: [
    { type: "text", name: "value", label: "value (0~100)", default: "50" },
    { type: "text", name: "label", label: "label", default: "Label" },
    { type: "text", name: "valueLabel", label: "valueLabel (빈칸=자동 %)", default: "" },
    { type: "boolean", name: "showLabelRow", label: "showLabelRow", default: true },
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
        <Progress
          value={Number.isFinite(v) ? v : 0}
          label={String(args.label)}
          valueLabel={vl === "" ? undefined : vl}
          showLabelRow={Boolean(args.showLabelRow)}
          showSecondaryLabel={Boolean(args.showSecondaryLabel)}
        />
      </div>
    );
  },
  gallery: <ProgressGallery />,
};

function ProgressGallery() {
  return (
    <div className="flex max-w-[256px] flex-col gap-6">
      <Progress value={0} label="0%" />
      <Progress value={25} label="업로드" valueLabel="25%" />
      <Progress value={50} label="Label" />
      <Progress value={75} label="설치" valueLabel="75%" />
      <Progress value={100} label="완료" />
      <Progress value={60} label="라벨행 없음" showLabelRow={false} />
      <Progress value={40} label="보조 없음" showSecondaryLabel={false} />
    </div>
  );
}
