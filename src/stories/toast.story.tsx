import { Toast } from "../components/ui/toast";
import type { ToastProps } from "../components/ui/toast";
import type { Story } from "../playground/types";

const TYPES: NonNullable<ToastProps["type"]>[] = ["default", "loading", "info", "success", "warning", "error"];

export const toastStory: Story = {
  name: "Toast",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7728-238",
  controls: [
    { type: "select", name: "type", label: "type", options: TYPES, default: "success" },
    { type: "text", name: "title", label: "title", default: "저장되었습니다" },
    { type: "text", name: "description", label: "description", default: "변경 사항이 반영되었어요." },
  ],
  render: (args) => (
    <div className="w-[360px]">
      <Toast type={args.type as ToastProps["type"]} title={String(args.title)}>
        {String(args.description)}
      </Toast>
    </div>
  ),
  gallery: (
    <div className="flex w-[360px] flex-col gap-3">
      {TYPES.map((t) => (
        <Toast key={t} type={t} title={`${t} 토스트`}>
          알림 메시지 내용입니다.
        </Toast>
      ))}
    </div>
  ),
};
