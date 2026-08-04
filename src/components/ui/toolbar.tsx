import * as React from "react";
import { cn } from "../../lib/utils";
import { Separator } from "./separator";

/**
 * Toolbar — Figma "BO UI Kit" Toolbar(node 7751:1057)를 옮긴 도구 모음 컨테이너.
 *
 * Figma 구조 매핑:
 *  - 컨테이너: HORIZONTAL · gap 2(gap-0.5) · pad 4(p-1) · bg #ffffff(bg-card) ·
 *    border 1px #e6eaf0(border-border) · radius 12(rounded-radius-xl) · 높이는 콘텐츠(32+8=40).
 *  - slot-toolbar-items(SLOT) → children. Figma 예시는 Toggle(iconOnly) ×N + Separator +
 *    Input + Button 인스턴스 — 기존 컴포넌트(Toggle/Separator/Input/Select/Button)를 합성한다.
 *  - Separator 인스턴스(Spacing 8/4) → ToolbarSeparator (h-5 세로선 + 좌우 여백).
 *
 * 접근성: role="toolbar" + aria-orientation. ←/→(Home/End 포함) 로 툴바 안 포커스 가능한
 * 컨트롤 사이를 이동하는 roving focus 를 제공한다(Tab 은 브라우저 기본 — 툴바 밖으로 나감).
 *
 * @see https://coss.com/ui/docs/components/toolbar
 */
export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 접근성 라벨 (여러 툴바가 있을 때 구분용) */
  "aria-label"?: string;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, onKeyDown, ...props }, ref) => {
    const innerRef = React.useRef<HTMLDivElement | null>(null);
    const mergeRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    const moveFocus = (dir: 1 | -1 | "first" | "last") => {
      const items = Array.from(
        innerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      if (dir === "first") return items[0].focus();
      if (dir === "last") return items[items.length - 1].focus();
      const idx = items.findIndex((el) => el === document.activeElement);
      if (idx === -1) return;
      items[(idx + dir + items.length) % items.length].focus();
    };

    return (
      <div
        ref={mergeRef}
        role="toolbar"
        aria-orientation="horizontal"
        data-node-id="7751:1057"
        className={cn(
          "inline-flex items-center gap-0.5 rounded-radius-xl border border-border bg-card p-1",
          className
        )}
        onKeyDown={(e) => {
          // 텍스트 입력(Input 등) 안에서는 ←/→ 가 캐럿 이동이어야 하므로 가로채지 않는다.
          const inText =
            e.target instanceof HTMLElement &&
            (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA");
          if (!inText) {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              moveFocus(1);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              moveFocus(-1);
            } else if (e.key === "Home") {
              e.preventDefault();
              moveFocus("first");
            } else if (e.key === "End") {
              e.preventDefault();
              moveFocus("last");
            }
          }
          onKeyDown?.(e);
        }}
        {...props}
      />
    );
  }
);
Toolbar.displayName = "Toolbar";

export interface ToolbarSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 좌우 여백(px) — Figma Separator 인스턴스의 Spacing 변형(8/4). 기본 8. */
  spacing?: 4 | 8;
}

/** 툴바 안 세로 구분선 — Figma Separator(Orientation=Vertical, 라인 높이 20). */
const ToolbarSeparator = React.forwardRef<HTMLDivElement, ToolbarSeparatorProps>(
  ({ className, spacing = 8, ...props }, ref) => (
    <Separator
      ref={ref}
      orientation="vertical"
      className={cn("h-5", spacing === 8 ? "mx-2" : "mx-1", className)}
      {...props}
    />
  )
);
ToolbarSeparator.displayName = "ToolbarSeparator";

export { Toolbar, ToolbarSeparator };
