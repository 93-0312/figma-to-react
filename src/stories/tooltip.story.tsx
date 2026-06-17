import { Tooltip } from "../components/ui/tooltip";
import type { TooltipProps } from "../components/ui/tooltip";
import { Button } from "../components/ui/button";
import type { Story } from "../playground/types";

const SIDES: NonNullable<TooltipProps["side"]>[] = ["top", "right", "bottom", "left"];

export const tooltipStory: Story = {
  name: "Tooltip",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=5685-185",
  controls: [
    { type: "select", name: "side", label: "side", options: SIDES, default: "top" },
    { type: "text", name: "content", label: "content", default: "힌트 텍스트" },
  ],
  render: (args) => (
    <div className="flex h-24 items-center justify-center">
      <Tooltip content={String(args.content)} side={args.side as TooltipProps["side"]}>
        <Button variant="outline">마우스를 올려보세요</Button>
      </Tooltip>
    </div>
  ),
  gallery: (
    <div className="flex flex-wrap gap-10 p-8">
      {SIDES.map((s) => (
        <Tooltip key={s} content={`${s} 툴팁`} side={s}>
          <Button variant="secondary">{s}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};
