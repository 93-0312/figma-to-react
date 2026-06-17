import { Drawer, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "../components/ui/drawer";
import { Button } from "../components/ui/button";
import type { SheetContentProps } from "../components/ui/sheet";
import type { Story } from "../playground/types";

const SIDES: NonNullable<SheetContentProps["side"]>[] = ["bottom", "top", "left", "right"];

export const drawerStory: Story = {
  name: "Drawer",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=8046-330",
  controls: [
    { type: "select", name: "side", label: "side", options: SIDES, default: "bottom" },
  ],
  render: (args, setArg) => (
    <>
      <Button variant="outline" onClick={() => setArg("open", true)}>드로어 열기</Button>
      <Drawer
        open={Boolean(args.open)}
        onOpenChange={(o) => setArg("open", o)}
        side={args.side as SheetContentProps["side"]}
      >
        <DrawerHeader>
          <DrawerTitle>드로어 제목</DrawerTitle>
          <DrawerDescription>여백 있는 플로팅(inset) 패널입니다.</DrawerDescription>
        </DrawerHeader>
        <div className="px-6 py-2 text-sm text-foreground">본문 영역</div>
        <DrawerFooter>
          <Button variant="secondary" onClick={() => setArg("open", false)}>닫기</Button>
          <Button onClick={() => setArg("open", false)}>확인</Button>
        </DrawerFooter>
      </Drawer>
    </>
  ),
};
