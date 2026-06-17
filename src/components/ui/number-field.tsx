import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * NumberField — Figma "BO UI Kit" NumberField(node 7781:5501). 증감 버튼이 달린 숫자 입력.
 *
 * Input 과 동일한 컨테이너 토큰/포커스(회색 3px 링, border-input). 좌(−)·우(+) 스텝퍼 버튼 +
 * 가운데 정렬 숫자 입력. size sm/md/lg(28/32/36). min/max/step·clamp 지원. 제어/비제어.
 * 아이콘은 7일 만료 에셋 대신 인라인 SVG.
 */
const numberFieldVariants = cva(
  "flex items-center rounded-radius border border-input bg-background text-foreground shadow-xs transition-colors " +
    "focus-within:border-disabled/30 focus-within:ring-[3px] focus-within:ring-offset-0 focus-within:ring-disabled/[0.07] " +
    "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-[0.64]",
  {
    variants: { size: { sm: "h-7", md: "h-8", lg: "h-9" } },
    defaultVariants: { size: "md" },
  }
);

function Stepper({ dir, ...props }: { dir: "dec" | "inc" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      tabIndex={-1}
      className="inline-flex h-full w-9 shrink-0 items-center justify-center text-foreground transition-colors hover:bg-secondary/50 disabled:opacity-40 [&_svg]:size-4"
      {...props}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        {dir === "dec" ? (
          <path d="M5 12h14" strokeLinecap="round" />
        ) : (
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}

export interface NumberFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "defaultValue" | "onChange">,
    VariantProps<typeof numberFieldVariants> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const NumberField = React.forwardRef<HTMLInputElement, NumberFieldProps>(
  ({ className, size, value, defaultValue = 0, onValueChange, min, max, step = 1, disabled, ...props }, ref) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState(defaultValue);
    const val = isControlled ? value : internal;
    const clamp = (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));
    const set = (n: number) => {
      const c = clamp(n);
      if (!isControlled) setInternal(c);
      onValueChange?.(c);
    };
    return (
      <div className={cn(numberFieldVariants({ size }), className)} data-node-id="7781:5501">
        <Stepper dir="dec" disabled={disabled || (min != null && val <= min)} onClick={() => set(val - step)} aria-label="감소" />
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          disabled={disabled}
          value={val}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isNaN(n)) set(n);
          }}
          className="min-w-0 flex-1 bg-transparent text-center text-sm text-foreground outline-none"
          {...props}
        />
        <Stepper dir="inc" disabled={disabled || (max != null && val >= max)} onClick={() => set(val + step)} aria-label="증가" />
      </div>
    );
  }
);
NumberField.displayName = "NumberField";

export { NumberField, numberFieldVariants };
