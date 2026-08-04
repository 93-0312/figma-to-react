import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from "../components/ui/popover";
import { Button, buttonVariants } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import type { Story } from "../playground/types";

export const popoverStory: Story = {
  name: "Popover",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7751-2411",
  controls: [
    { type: "text", name: "title", label: "title", default: "Title" },
    { type: "text", name: "description", label: "description", default: "Description" },
    { type: "select", name: "align", label: "align", options: ["start", "center", "end"], default: "start" },
    { type: "boolean", name: "open", label: "open", default: true },
  ],
  render: (args, setArg) => (
    <div className="flex min-h-[320px] items-start justify-center pt-2">
      <Popover open={Boolean(args.open)} onOpenChange={(o) => setArg("open", o)}>
        <PopoverTrigger className={buttonVariants({ variant: "outline", size: "md" })}>
          <span data-label className="px-1">Open popover</span>
        </PopoverTrigger>
        <PopoverContent align={args.align as "start" | "center" | "end"}>
          <PopoverHeader>
            <PopoverTitle>{String(args.title)}</PopoverTitle>
            <PopoverDescription>{String(args.description)}</PopoverDescription>
          </PopoverHeader>
          <Textarea placeholder="Label" rows={3} />
          <Button className="w-full">Label</Button>
        </PopoverContent>
      </Popover>
    </div>
  ),
  gallery: <PopoverGallery />,
};

/** Figma 슬롯 예시 그대로(제목+설명+Textarea+Button) + 변형(설명 없음/텍스트만) 정적 매트릭스 */
function PopoverGallery() {
  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex h-[300px] w-[340px] flex-col gap-1">
        <span className="text-xs text-muted-foreground">Figma 예시 (Textarea + Button)</span>
        <Popover defaultOpen>
          <PopoverTrigger className={buttonVariants({ variant: "outline", size: "md" })}>
            <span data-label className="px-1">Trigger</span>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>Title</PopoverTitle>
              <PopoverDescription>Description</PopoverDescription>
            </PopoverHeader>
            <Textarea placeholder="Label" rows={3} />
            <Button className="w-full">Label</Button>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex h-[300px] w-[340px] flex-col gap-1">
        <span className="text-xs text-muted-foreground">텍스트만 (Title + Description)</span>
        <Popover defaultOpen>
          <PopoverTrigger className={buttonVariants({ variant: "outline", size: "md" })}>
            <span data-label className="px-1">Trigger</span>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>Dimensions</PopoverTitle>
              <PopoverDescription>
                Set the dimensions for the layer. 이 패널은 임의 콘텐츠 슬롯이다.
              </PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex h-[300px] w-[340px] flex-col gap-1">
        <span className="text-xs text-muted-foreground">align=end</span>
        <div className="flex justify-end">
          <Popover defaultOpen>
            <PopoverTrigger className={buttonVariants({ variant: "outline", size: "md" })}>
              <span data-label className="px-1">Trigger</span>
            </PopoverTrigger>
            <PopoverContent align="end">
              <PopoverHeader>
                <PopoverTitle>Title</PopoverTitle>
                <PopoverDescription>우측 정렬 패널</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
