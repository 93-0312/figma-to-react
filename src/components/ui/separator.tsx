import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Separator — Figma "BO UI Kit" Separator(node 3605:3065). 영역 구분선.
 *
 * 1px 라인(`border` 토큰, #0f172b @8%). orientation: horizontal(h-px w-full) / vertical(w-px h-full).
 * 접근성: 의미상 구분이면 `decorative={false}` → role=separator + aria-orientation, 장식이면 기본(role=none).
 * (Figma 의 Spacing 변형은 여백 — 소비자가 className(margin)으로 처리.)
 */
export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  /** 장식용(기본 true). false 면 스크린리더에 구분선으로 노출. */
  decorative?: boolean;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
    <div
      ref={ref}
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      data-node-id="3605:3065"
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = "Separator";

export { Separator };
