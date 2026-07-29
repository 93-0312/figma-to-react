import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Tooltip — Figma "BO UI Kit" Tooltip(node 5685:185). hover/focus 시 뜨는 힌트.
 *
 * 트리거를 감싸고, hover/focus 시 다크 칩 라벨을 표시(테두리/그림자 없음, radius-sm).
 * (2026-07-27 갱신: 기존 popover 흰 배경+테두리+shadow-overlay → bg-tooltip 다크 배경 단색으로 재설계.)
 * side top/right/bottom/left. CSS group-hover/focus-within 기반(경량). 내용 text-xs tooltip-foreground.
 *
 * 접근성: 툴팁에 useId 기반 id 를 달고 트리거(단일 엘리먼트면 cloneElement, 아니면 래퍼)에
 * aria-describedby 로 연결. Escape 로 포인터/포커스 이동 없이 닫을 수 있다(WCAG 1.4.13) —
 * hover 를 벗어났다 다시 올리면 재표시. 긴 내용은 max-w-xs 에서 줄바꿈된다.
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
  ({ className, content, side = "top", children, ...props }, ref) => {
    const tooltipId = React.useId();
    const [dismissed, setDismissed] = React.useState(false);
    // 단일 엘리먼트 트리거에는 aria-describedby 를 직접 단다(포커스 요소에 연결돼야 낭독됨).
    const trigger = React.isValidElement(children)
      ? React.cloneElement(children as React.ReactElement, { "aria-describedby": tooltipId })
      : children;
    return (
      <span
        ref={ref}
        aria-describedby={React.isValidElement(children) ? undefined : tooltipId}
        onKeyDown={(e) => {
          if (e.key === "Escape") setDismissed(true);
        }}
        // 재무장(re-arm)은 벗어날 때 + 다시 진입할 때 양쪽에 건다 — Escape 로 닫은 상태가
        // hover/focus 세션을 넘겨 고착되지 않게.
        onMouseEnter={() => setDismissed(false)}
        onMouseLeave={() => setDismissed(false)}
        onFocus={() => setDismissed(false)}
        onBlur={() => setDismissed(false)}
        className={cn("group relative inline-flex", className)}
        {...props}
      >
        {trigger}
        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-50 w-max max-w-xs rounded-radius-sm bg-tooltip px-3 py-2 text-xs text-tooltip-foreground opacity-0 transition-opacity duration-150",
            !dismissed && "group-hover:opacity-100 group-focus-within:opacity-100",
            sidePos[side]
          )}
        >
          {content}
        </span>
      </span>
    );
  }
);
Tooltip.displayName = "Tooltip";

export { Tooltip };
