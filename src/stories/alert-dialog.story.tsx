import { AlertDialog } from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import type { Story } from "../playground/types";

export const alertDialogStory: Story = {
  name: "Alert Dialog",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=5655-5142",
  controls: [
    { type: "boolean", name: "destructive", label: "destructive", default: true },
  ],
  render: (args, setArg) => (
    <>
      <Button variant={args.destructive ? "destructive" : "default"} onClick={() => setArg("open", true)}>
        계정 삭제
      </Button>
      <AlertDialog
        open={Boolean(args.open)}
        onOpenChange={(o) => setArg("open", o)}
        title="정말 삭제할까요?"
        description="이 작업은 되돌릴 수 없습니다. 계정과 모든 데이터가 영구 삭제됩니다."
        cancelText="취소"
        actionText="삭제"
        destructive={Boolean(args.destructive)}
      />
    </>
  ),
};
