import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import type { Story } from "../playground/types";

export const dialogStory: Story = {
  name: "Dialog",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7656-1889",
  controls: [
    { type: "text", name: "title", label: "title", default: "변경 사항 저장" },
    { type: "text", name: "description", label: "description", default: "이 작업을 계속하시겠어요?" },
  ],
  render: (args, setArg) => (
    <>
      <Button onClick={() => setArg("open", true)}>다이얼로그 열기</Button>
      <Dialog open={Boolean(args.open)} onOpenChange={(o) => setArg("open", o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{String(args.title)}</DialogTitle>
            <DialogDescription>{String(args.description)}</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-muted-foreground">
              저장하지 않은 변경 사항이 있습니다. 지금 저장하면 현재 내용이 반영되고, 취소하면 마지막
              저장 시점으로 되돌아갑니다.
            </p>
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setArg("open", false)}>취소</Button>
            <Button onClick={() => setArg("open", false)}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  ),
};
