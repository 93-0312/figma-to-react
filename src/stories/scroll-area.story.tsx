import { ScrollArea } from "../components/ui/scroll-area";
import type { Story } from "../playground/types";

const ITEMS = Array.from({ length: 20 }, (_, i) => `항목 ${i + 1}`);

export const scrollAreaStory: Story = {
  name: "Scroll Area",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7669-1745",
  controls: [
    { type: "boolean", name: "bordered", label: "bordered", default: true },
  ],
  render: (args) => (
    <ScrollArea bordered={Boolean(args.bordered)} className="h-[200px] w-[256px]">
      <div className="flex flex-col gap-1.5 text-sm text-foreground">
        {ITEMS.map((it) => (
          <span key={it}>{it}</span>
        ))}
      </div>
    </ScrollArea>
  ),
  gallery: (
    <ScrollArea className="h-[180px] w-[240px]">
      <div className="flex flex-col gap-1.5 text-sm text-foreground">
        {ITEMS.map((it) => (
          <span key={it}>{it}</span>
        ))}
      </div>
    </ScrollArea>
  ),
};
