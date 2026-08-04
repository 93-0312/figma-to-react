import { Tooltip, TooltipCursorArrow } from "../components/ui/tooltip";
import type { TooltipProps } from "../components/ui/tooltip";
import type { Story } from "../playground/types";

const PLACEMENTS: NonNullable<TooltipProps["cursorPlacement"]>[] = [
  "right",
  "left",
  "middle",
];

/**
 * tooltip-withCursor(9695:27058) 데모 — 기존 tooltip.story.tsx 는 스냅샷 보호로 두고
 * withCursor 확장만 별도 스토리로 다룬다.
 */
export const tooltipCursorStory: Story = {
  name: "Tooltip (withCursor)",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=9695-27058",
  controls: [
    {
      type: "select",
      name: "cursorPlacement",
      label: "Property 1 (tooltip-*)",
      options: PLACEMENTS,
      default: "right",
    },
    { type: "text", name: "content", label: "content", default: "Hint Text" },
  ],
  render: (args) => (
    <Tooltip
      withCursor
      cursorPlacement={args.cursorPlacement as TooltipProps["cursorPlacement"]}
      content={String(args.content)}
    >
      <div className="flex h-48 w-80 items-center justify-center rounded-radius-lg border border-dashed border-border text-xs text-muted-foreground">
        이 영역에서 마우스를 움직여보세요
      </div>
    </Tooltip>
  ),
  gallery: <TooltipCursorGallery />,
};

/** Figma 3개 variant 정적 재현(칩 + 커서 그래픽, gap 10 / 세로중앙 / 위 중앙) — 시각 회귀용 */
function TooltipCursorGallery() {
  const chip = (
    <span className="inline-flex w-max items-center rounded-radius-sm bg-tooltip px-3 py-2 text-xs text-tooltip-foreground">
      Hint Text
    </span>
  );
  return (
    <div className="flex flex-col gap-10 p-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">Property 1=tooltip-right</span>
        <div className="flex items-center gap-2.5">
          <TooltipCursorArrow />
          {chip}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">Property 1=tooltip-left</span>
        <div className="flex items-center gap-2.5">
          {chip}
          <TooltipCursorArrow />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">Property 1=tooltip-middle</span>
        <div className="flex flex-col items-center gap-2.5 self-start">
          {chip}
          <TooltipCursorArrow />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">
          Live: withCursor 3종 (hover 시 실제 커서 기준 배치)
        </span>
        <div className="flex gap-4">
          {PLACEMENTS.map((p) => (
            <Tooltip key={p} withCursor cursorPlacement={p} content="Hint Text">
              <div className="flex h-24 w-40 items-center justify-center rounded-radius-lg border border-dashed border-border text-xs text-muted-foreground">
                {p}
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
}
