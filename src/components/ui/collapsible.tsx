import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Collapsible — Figma "BO UI Kit" Collapsible(node 5677:165). 버튼으로 여닫는 패널.
 *
 * 트리거 행(제목 + chevron-down, 펼침 시 회전) + 펼침 시 내용. 제어/비제어(open/defaultOpen/onOpenChange).
 */
export interface CollapsibleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 트리거에 표시할 제목 */
  title: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ className, title, open, defaultOpen = false, onOpenChange, disabled, children, ...props }, ref) => {
    const isControlled = open !== undefined;
    const [internal, setInternal] = React.useState(defaultOpen);
    const isOpen = isControlled ? open : internal;
    return (
      <div ref={ref} data-node-id="5677:165" className={cn("w-full", className)} {...props}>
        <button
          type="button"
          aria-expanded={isOpen}
          disabled={disabled}
          onClick={() => {
            if (!isControlled) setInternal((v) => !v);
            onOpenChange?.(!isOpen);
          }}
          className="flex w-full items-center gap-1 text-left text-sm text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-offset-0 focus-visible:ring-disabled/[0.07] disabled:cursor-not-allowed disabled:opacity-[0.64]"
        >
          <span className="min-w-0 flex-1">{title}</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
            className={cn("size-5 shrink-0 transition-transform", isOpen && "rotate-180")}
          >
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {isOpen && <div className="pt-2 text-sm text-muted-foreground">{children}</div>}
      </div>
    );
  }
);
Collapsible.displayName = "Collapsible";

export { Collapsible };
