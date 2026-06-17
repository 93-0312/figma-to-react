import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * ScrollArea — Figma "BO UI Kit" Scroll Area(node 7669:1745). 커스텀 스크롤바 컨테이너.
 *
 * overflow-auto + 얇은 커스텀 스크롤바(thumb=foreground@20%, rounded-full). 테두리/패딩은 기본 제공,
 * 높이는 className(max-h 등)으로 지정. Figma 의 하단 fade 는 선택(scrollFade).
 */
export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 테두리/패딩 박스 스타일 적용(기본 true) */
  bordered?: boolean;
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, bordered = true, children, ...props }, ref) => (
    <div
      ref={ref}
      data-node-id="7669:1745"
      className={cn(
        "max-h-[204px] overflow-auto",
        // 얇은 커스텀 스크롤바
        "[scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:rounded-radius-full [&::-webkit-scrollbar-thumb]:bg-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-foreground/30",
        bordered && "rounded-radius border border-border px-4 py-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
