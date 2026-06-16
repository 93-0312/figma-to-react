import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Select — Figma "BO UI Kit" Select(node 7751:561 패널) + .SelectItem(7751:1704) 를 옮긴
 * 드롭다운 선택 컴포넌트. 미리 정의된 값 중 하나를 고르는 폼 컨트롤.
 *
 * 구성:
 *  - 트리거: Input 과 동일한 토큰/포커스(회색 3px 링)로 디자인. (Figma Select 노드는 열린 패널만
 *    포함하므로 트리거는 디자인 시스템 Input 관례를 따른다 — 문서화된 결정.)
 *  - 패널(SelectContent): popover 배경, border, rounded-radius-xl, shadow-popover, p-1, gap-px.
 *  - 항목(SelectItem): h-28, rounded-radius-lg, text-xs medium, accent-foreground 텍스트.
 *      · 선택됨 → 좌측 체크 표시 + 배경 primary/4%
 *      · hover  → 배경 accent(#f8fafc)
 *
 * 동작: 클릭 토글, 바깥 클릭/Escape 로 닫힘, ↑/↓ 로 항목 이동(roving focus). 제어·비제어 지원.
 *
 * @see https://coss.com/ui/docs/components/select
 */
export interface SelectOption {
  value: string;
  label: React.ReactNode;
  /** 라벨 앞 아이콘(선택) */
  icon?: React.ReactNode;
  disabled?: boolean;
}

const selectTriggerVariants = cva(
  "flex w-full select-none items-center justify-between gap-1 rounded-radius border bg-card text-sm text-foreground shadow-xs transition-colors outline-none " +
    "focus-visible:ring-[3px] focus-visible:ring-offset-0 " +
    "disabled:cursor-not-allowed disabled:opacity-[0.64]",
  {
    variants: {
      inputSize: { sm: "h-7 px-1.5", md: "h-8 px-2", lg: "h-9 px-2" },
      invalid: {
        true: "border-destructive focus-visible:ring-destructive/[0.15]",
        false:
          "border-input focus-visible:border-disabled/30 focus-visible:ring-disabled/[0.07]",
      },
    },
    defaultVariants: { inputSize: "md", invalid: false },
  }
);

export interface SelectProps
  extends VariantProps<typeof selectTriggerVariants> {
  options: SelectOption[];
  /** 제어 값 */
  value?: string;
  /** 비제어 초기 값 */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: React.ReactNode;
  disabled?: boolean;
  /** 트리거 클래스 */
  className?: string;
  /** 패널 클래스 */
  contentClassName?: string;
  id?: string;
  name?: string;
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className="size-4"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      placeholder = "Select…",
      disabled = false,
      inputSize,
      invalid,
      className,
      contentClassName,
      id,
      name,
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<string | undefined>(
      defaultValue
    );
    const current = isControlled ? value : internal;

    const [open, setOpen] = React.useState(false);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const listRef = React.useRef<HTMLDivElement>(null);

    const selected = options.find((o) => o.value === current);

    // 바깥 클릭으로 닫기
    React.useEffect(() => {
      if (!open) return;
      const onPointerDown = (e: MouseEvent) => {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", onPointerDown);
      return () => document.removeEventListener("mousedown", onPointerDown);
    }, [open]);

    // 열릴 때 선택된(없으면 첫) 항목으로 포커스 이동
    React.useEffect(() => {
      if (!open) return;
      const items = listRef.current?.querySelectorAll<HTMLButtonElement>(
        "[data-select-item]:not([disabled])"
      );
      if (!items?.length) return;
      const selectedEl = Array.from(items).find(
        (el) => el.dataset.value === current
      );
      (selectedEl ?? items[0]).focus();
    }, [open, current]);

    const choose = (v: string) => {
      if (!isControlled) setInternal(v);
      onValueChange?.(v);
      setOpen(false);
    };

    const moveFocus = (dir: 1 | -1) => {
      const items = Array.from(
        listRef.current?.querySelectorAll<HTMLButtonElement>(
          "[data-select-item]:not([disabled])"
        ) ?? []
      );
      const idx = items.findIndex((el) => el === document.activeElement);
      const next = items[(idx + dir + items.length) % items.length];
      next?.focus();
    };

    return (
      <div ref={rootRef} className="relative">
        <button
          ref={ref}
          type="button"
          id={id}
          name={name}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          data-node-id="7751:1561"
          className={cn(selectTriggerVariants({ inputSize, invalid }), className)}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        >
          <span
            className={cn(
              "truncate",
              !selected && "text-muted-foreground"
            )}
          >
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 opacity-50 transition-transform",
              open && "rotate-180"
            )}
          />
        </button>

        {open && (
          <div
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            className={cn(
              "absolute left-0 top-full z-50 mt-1 flex max-h-64 w-full flex-col gap-px overflow-auto rounded-radius-xl border border-border bg-popover p-1 shadow-popover",
              contentClassName
            )}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setOpen(false);
                rootRef.current
                  ?.querySelector<HTMLButtonElement>("button")
                  ?.focus();
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                moveFocus(1);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                moveFocus(-1);
              }
            }}
          >
            {options.map((opt) => {
              const isSelected = opt.value === current;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={opt.disabled}
                  data-select-item=""
                  data-value={opt.value}
                  className={cn(
                    "flex h-7 w-full items-center gap-0.5 rounded-radius-lg px-0.5 text-left text-xs font-medium text-accent-foreground outline-none transition-colors",
                    "hover:bg-accent focus-visible:bg-accent",
                    "disabled:pointer-events-none disabled:opacity-[0.64]",
                    isSelected && "bg-primary/[0.04]"
                  )}
                  onClick={() => choose(opt.value)}
                >
                  <span className="flex size-7 shrink-0 items-center justify-center">
                    {isSelected ? <CheckMark /> : null}
                  </span>
                  {opt.icon ? (
                    <span className="inline-flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
                      {opt.icon}
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select, selectTriggerVariants };
