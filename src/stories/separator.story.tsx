import { Separator } from "../components/ui/separator";
import type { Story } from "../playground/types";

export const separatorStory: Story = {
  name: "Separator",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=3605-3065",
  controls: [
    { type: "select", name: "orientation", label: "orientation", options: ["horizontal", "vertical"], default: "horizontal" },
  ],
  render: (args) =>
    args.orientation === "vertical" ? (
      <div className="flex h-12 items-center gap-3 text-sm text-foreground">
        <span>왼쪽</span>
        <Separator orientation="vertical" />
        <span>가운데</span>
        <Separator orientation="vertical" />
        <span>오른쪽</span>
      </div>
    ) : (
      <div className="w-[240px] text-sm text-foreground">
        <p>위 영역</p>
        <Separator className="my-3" />
        <p>아래 영역</p>
      </div>
    ),
  gallery: (
    <div className="flex flex-col gap-6">
      <div className="w-[240px]">
        <span className="text-xs text-muted-foreground">horizontal</span>
        <Separator className="my-2" />
      </div>
      <div className="flex h-10 items-center gap-3 text-sm">
        <span className="text-xs text-muted-foreground">vertical</span>
        <Separator orientation="vertical" />
        <span>A</span>
        <Separator orientation="vertical" />
        <span>B</span>
      </div>
    </div>
  ),
};
