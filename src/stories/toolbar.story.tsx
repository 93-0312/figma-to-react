import { Toolbar, ToolbarSeparator } from "../components/ui/toolbar";
import { Toggle } from "../components/ui/toggle";
import { Select } from "../components/ui/select";
import { Button } from "../components/ui/button";
import type { Story } from "../playground/types";

/* Figma 예시 슬롯의 아이콘(정렬/볼드/이탤릭) — 단순 도형이라 인라인 SVG(currentColor) */
function AlignLeftIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <path d="M2 4h12M2 8h8M2 12h10" />
    </svg>
  );
}
function AlignCenterIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <path d="M2 4h12M4 8h8M3 12h10" />
    </svg>
  );
}
function AlignRightIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <path d="M2 4h12M6 8h8M4 12h10" />
    </svg>
  );
}
function BoldIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4.5 2.5h4a2.5 2.5 0 0 1 0 5h-4zM4.5 7.5h5a2.75 2.75 0 0 1 0 5.5h-5z" />
    </svg>
  );
}
function ItalicIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <path d="M6.5 2.5h5M4.5 13.5h5M9 2.5l-2 11" />
    </svg>
  );
}

const FONTS = ["Helvetica", "Arial", "Pretendard", "Georgia"].map((f) => ({
  value: f,
  label: f,
}));

export const toolbarStory: Story = {
  name: "Toolbar",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7751-1057",
  controls: [
    { type: "select", name: "align", label: "text align", options: ["left", "center", "right"], default: "left" },
    { type: "boolean", name: "bold", label: "bold", default: false },
    { type: "boolean", name: "italic", label: "italic", default: false },
    { type: "select", name: "font", label: "font", options: FONTS.map((f) => f.value), default: "Helvetica" },
  ],
  render: (args, setArg) => (
    <Toolbar aria-label="서식 도구 모음">
      <Toggle iconOnly aria-label="왼쪽 정렬" pressed={args.align === "left"} onPressedChange={() => setArg("align", "left")}>
        <AlignLeftIcon />
      </Toggle>
      <Toggle iconOnly aria-label="가운데 정렬" pressed={args.align === "center"} onPressedChange={() => setArg("align", "center")}>
        <AlignCenterIcon />
      </Toggle>
      <Toggle iconOnly aria-label="오른쪽 정렬" pressed={args.align === "right"} onPressedChange={() => setArg("align", "right")}>
        <AlignRightIcon />
      </Toggle>
      <ToolbarSeparator />
      <Toggle iconOnly aria-label="굵게" pressed={Boolean(args.bold)} onPressedChange={(v) => setArg("bold", v)}>
        <BoldIcon />
      </Toggle>
      <Toggle iconOnly aria-label="기울임" pressed={Boolean(args.italic)} onPressedChange={(v) => setArg("italic", v)}>
        <ItalicIcon />
      </Toggle>
      <ToolbarSeparator />
      <div className="w-[140px]">
        <Select options={FONTS} value={String(args.font)} onValueChange={(v) => setArg("font", v)} />
      </div>
      <ToolbarSeparator spacing={4} />
      <Button>Save</Button>
    </Toolbar>
  ),
  gallery: <ToolbarGallery />,
};

function ToolbarGallery() {
  return (
    <div className="flex flex-col items-start gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Figma 예시 구성 (Toggle ×3 | Toggle ×2 | Select | Button)</span>
        <Toolbar aria-label="서식 도구 모음 (예시)">
          <Toggle iconOnly aria-label="왼쪽 정렬" defaultPressed>
            <AlignLeftIcon />
          </Toggle>
          <Toggle iconOnly aria-label="가운데 정렬">
            <AlignCenterIcon />
          </Toggle>
          <Toggle iconOnly aria-label="오른쪽 정렬">
            <AlignRightIcon />
          </Toggle>
          <ToolbarSeparator />
          <Toggle iconOnly aria-label="굵게">
            <BoldIcon />
          </Toggle>
          <Toggle iconOnly aria-label="기울임">
            <ItalicIcon />
          </Toggle>
          <ToolbarSeparator />
          <div className="w-[140px]">
            <Select options={FONTS} defaultValue="Helvetica" />
          </div>
          <ToolbarSeparator spacing={4} />
          <Button>Save</Button>
        </Toolbar>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">토글만 (미니 툴바)</span>
        <Toolbar aria-label="정렬 도구 모음">
          <Toggle iconOnly aria-label="왼쪽 정렬">
            <AlignLeftIcon />
          </Toggle>
          <Toggle iconOnly aria-label="가운데 정렬" defaultPressed>
            <AlignCenterIcon />
          </Toggle>
          <Toggle iconOnly aria-label="오른쪽 정렬">
            <AlignRightIcon />
          </Toggle>
        </Toolbar>
      </div>
    </div>
  );
}
