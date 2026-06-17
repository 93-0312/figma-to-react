import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Tooltip — Figma "BO UI Kit" Tooltip(node 5685:185). hover/focus 시 뜨는 힌트.
 *
 * 트리거를 감싸고, hover/focus 시 popover 배경 + border + shadow 라벨을 표시(+화살표).
 * side top/right/bottom/left. CSS group-hover/focus-within 기반(경량). 내용 text-xs foreground.
 */
export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "content"> {
  /** 툴팁 내용 */
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

const sidePos: Record<NonNullable<TooltipProps["side"]>, string> = {
  top: "bottom-full left-1/2 mb-1.5 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-1.5 -translate-x-1/2",
  left: "right-full top-1/2 mr-1.5 -translate-y-1/2",
  right: "left-full top-1/2 ml-1.5 -translate-y-1/2",
};

const Tooltip = React.forwardRef<HTMLSpanElement, TooltipProps>(
  ({ className, content, side = "top", children, ...props }, ref) => (
    <span ref={ref} className={cn("group relative inline-flex", className)} {...props}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 w-max max-w-xs whitespace-nowrap rounded-radius-lg border border-border bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow-popover transition-opacity duration-150",
          "group-hover:opacity-100 group-focus-within:opacity-100",
          sidePos[side]
        )}
      >
        {content}
      </span>
    </span>
  )
);
Tooltip.displayName = "Tooltip";

export { Tooltip };
