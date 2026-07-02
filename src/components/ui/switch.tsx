import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Switch — Figma "BO UI Kit" Switch(node 7715:1962). 설정 on/off 토글.
 *
 * Figma 변형: Size(Default 18×30 / Large 24×44) · Checked · Disabled.
 * 트랙: off=input(테두리 8%) / on=success(#00d492) + 안쪽 그림자. thumb: card(흰색) + shadow-xs.
 * 제어/비제어(`checked`/`defaultChecked`/`onCheckedChange`). 접근성: role=switch + aria-checked.
 */
const switchVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center rounded-radius-full p-0.5 outline-none transition-colors " +
    // 트랙 안쪽 그림자 — Tailwind 내장 shadow-inner(inset 0 2px 4px 0 rgb(0 0 0 / 0.05))와
    // Figma 값이 정확히 일치해 내장 토큰 사용(임의 하드코딩 금지 규칙).
    "shadow-inner " +
    "focus-visible:ring-[3px] focus-visible:ring-offset-0 focus-visible:ring-disabled/[0.07] " +
    "disabled:cursor-not-allowed disabled:opacity-[0.64] " +
    "data-[state=on]:bg-success data-[state=off]:bg-input",
  {
    variants: {
      size: { md: "h-[18px] w-[30px]", lg: "h-6 w-11" },
    },
    defaultVariants: { size: "md" },
  }
);

const thumbVariants = cva(
  "pointer-events-none block rounded-radius-full bg-card shadow-xs transition-transform",
  {
    variants: {
      size: {
        md: "size-[14px] data-[state=on]:translate-x-3",
        lg: "size-5 data-[state=on]:translate-x-5",
      },
    },
    defaultVariants: { size: "md" },
  }
);

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onChange">,
    VariantProps<typeof switchVariants> {
  /** 켜짐 상태(제어). */
  checked?: boolean;
  /** 비제어 초기 상태. */
  defaultChecked?: boolean;
  /** 상태 변경 콜백. */
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, size, checked, defaultChecked = false, onCheckedChange, onClick, disabled, ...props }, ref) => {
    const isControlled = checked !== undefined;
    const [internal, setInternal] = React.useState(defaultChecked);
    const on = isControlled ? checked : internal;
    const state = on ? "on" : "off";
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={on}
        disabled={disabled}
        data-state={state}
        className={cn(switchVariants({ size }), className)}
        onClick={(e) => {
          if (!isControlled) setInternal((v) => !v);
          onCheckedChange?.(!on);
          onClick?.(e);
        }}
        data-node-id="7715:1962"
        {...props}
      >
        <span data-state={state} className={thumbVariants({ size })} />
      </button>
    );
  }
);
Switch.displayName = "Switch";

export { Switch, switchVariants };
