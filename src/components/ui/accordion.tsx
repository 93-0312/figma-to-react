import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Accordion / AccordionItem — Figma "BO UI Kit" Accordion(AccordionItem 1673:58).
 *
 * 항목 = 제목행(선택 아이콘+제목+chevron) + 펼침 시 설명/내용 + 구분선. chevron 은 펼침 시 회전.
 * type single(하나만) / multiple. 제어/비제어(value). 내용 영역은 펼침 시 렌더.
 *
 * 접근성: 트리거 버튼 ↔ 패널을 useId 기반 id/aria-controls/aria-labelledby 로 연결하고
 * 패널은 role="region" (APG Accordion 패턴).
 */
interface AccordionContextValue {
  isOpen: (v: string) => boolean;
  toggle: (v: string) => void;
}
const AccordionContext = React.createContext<AccordionContextValue | null>(null);

type AccordionBase = { className?: string; children?: React.ReactNode };
export type AccordionProps = AccordionBase &
  (
    | { type?: "single"; value?: string; defaultValue?: string; onValueChange?: (v: string) => void }
    | { type: "multiple"; value?: string[]; defaultValue?: string[]; onValueChange?: (v: string[]) => void }
  );

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>((props, ref) => {
  const { type = "single", className, children } = props;
  const isControlled = (props as { value?: unknown }).value !== undefined;
  const [internal, setInternal] = React.useState<string[]>(() => {
    const dv = (props as { defaultValue?: string | string[] }).defaultValue;
    return dv == null ? [] : Array.isArray(dv) ? dv : [dv];
  });
  const valueProp = (props as { value?: string | string[] }).value;
  const open = isControlled ? (Array.isArray(valueProp) ? valueProp : valueProp ? [valueProp] : []) : internal;

  const toggle = (v: string) => {
    let next: string[];
    if (type === "multiple") {
      next = open.includes(v) ? open.filter((x) => x !== v) : [...open, v];
      if (!isControlled) setInternal(next);
      (props as { onValueChange?: (x: string[]) => void }).onValueChange?.(next);
    } else {
      next = open.includes(v) ? [] : [v];
      if (!isControlled) setInternal(next);
      (props as { onValueChange?: (x: string) => void }).onValueChange?.(next[0] ?? "");
    }
  };

  return (
    <AccordionContext.Provider value={{ isOpen: (v) => open.includes(v), toggle }}>
      <div ref={ref} data-node-id="1673:58" className={cn("w-full", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
});
Accordion.displayName = "Accordion";

export interface AccordionItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  value: string;
  title: React.ReactNode;
  /** 제목 앞 아이콘(선택) */
  icon?: React.ReactNode;
  /** 하단 구분선 표시(기본 true) */
  showSeparator?: boolean;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, title, icon, showSeparator = true, children, ...props }, ref) => {
    const ctx = React.useContext(AccordionContext);
    if (!ctx) throw new Error("AccordionItem must be used within Accordion");
    const open = ctx.isOpen(value);
    const baseId = React.useId();
    const triggerId = `${baseId}-trigger`;
    const panelId = `${baseId}-panel`;
    return (
      <div
        ref={ref}
        className={cn("w-full", showSeparator && "border-b border-border", className)}
        {...props}
      >
        <button
          type="button"
          id={triggerId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => ctx.toggle(value)}
          className="flex w-full items-center gap-1 py-4 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-offset-0 focus-visible:ring-disabled/[0.07]"
        >
          <span className="flex flex-1 items-center gap-2.5 text-sm font-medium text-foreground">
            {icon ? <span className="inline-flex shrink-0 [&_svg]:size-5">{icon}</span> : null}
            {title}
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
            className={cn("size-5 shrink-0 text-foreground transition-transform", open && "rotate-180")}
          >
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {open && (
          <div id={panelId} role="region" aria-labelledby={triggerId} className="pb-4 text-sm text-muted-foreground">
            {children}
          </div>
        )}
      </div>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

export { Accordion, AccordionItem };
