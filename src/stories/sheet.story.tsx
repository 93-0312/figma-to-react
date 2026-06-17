import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "../components/ui/sheet";
import { Button } from "../components/ui/button";
import type { SheetContentProps } from "../components/ui/sheet";
import type { Story } from "../playground/types";

const SIDES: NonNullable<SheetContentProps["side"]>[] = ["right", "left", "top", "bottom"];

export const sheetStory: Story = {
  name: "Sheet",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7669-1795",
  controls: [
    { type: "select", name: "side", label: "side", options: SIDES, default: "right" },
    { type: "boolean", name: "inset", label: "inset (플로팅)", default: false },
  ],
  render: (args, setArg) => (
    <>
      <Button variant="outline" onClick={() => setArg("open", true)}>시트 열기</Button>
      <Sheet open={Boolean(args.open)} onOpenChange={(o) => setArg("open", o)}>
        <SheetContent side={args.side as SheetContentProps["side"]} inset={Boolean(args.inset)}>
          <SheetHeader>
            <SheetTitle>설정</SheetTitle>
            <SheetDescription>옆에서 슬라이드되는 패널입니다.</SheetDescription>
          </SheetHeader>
          <div className="px-6 py-2 text-sm text-foreground">본문 영역</div>
          <SheetFooter>
            <Button variant="secondary" onClick={() => setArg("open", false)}>닫기</Button>
            <Button onClick={() => setArg("open", false)}>저장</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  ),
};
