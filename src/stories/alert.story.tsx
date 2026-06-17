import { Alert } from "../components/ui/alert";
import type { AlertProps } from "../components/ui/alert";
import type { Story } from "../playground/types";

const TYPES: NonNullable<AlertProps["type"]>[] = ["default", "info", "success", "warning", "error"];

export const alertStory: Story = {
  name: "Alert",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=5655-4958",
  controls: [
    { type: "select", name: "type", label: "type", options: TYPES, default: "info" },
    { type: "text", name: "title", label: "title", default: "알림 제목" },
    { type: "text", name: "description", label: "description", default: "부가 설명 텍스트입니다." },
  ],
  render: (args) => (
    <div className="w-[420px]">
      <Alert type={args.type as AlertProps["type"]} title={String(args.title)}>
        {String(args.description)}
      </Alert>
    </div>
  ),
  gallery: (
    <div className="flex w-[420px] flex-col gap-3">
      {TYPES.map((t) => (
        <Alert key={t} type={t} title={`${t} 알림`}>
          상태별 색상 미리보기입니다.
        </Alert>
      ))}
    </div>
  ),
};
