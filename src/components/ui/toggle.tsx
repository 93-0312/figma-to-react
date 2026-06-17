import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Toggle — Figma "BO UI Kit" Toggle 컴포넌트(node 5685:204)를 옮긴 2-state 버튼.
 *
 * Figma 의 `State`(Default/Active/Hover/Disabled) 는 상호작용 의사상태(hover/disabled)와
 * on/off 의미상태(Active)가 섞여 있어 그대로 prop 으로 평탄화하지 않고 아래처럼 매핑한다:
 *  - `pressed`(boolean) → Figma `State=Active`(눌림/켜짐). aria-pressed + data-state=on.
 *  - `:hover`           → Figma `State=Hover`  (CSS, off 일 때만)
 *  - `disabled`         → Figma `State=Disabled`(CSS)
 *  - 기본               → Figma `State=Default`
 *
 * 상태 진리표(배경):
 *  - off              : 투명 (outline 변형은 card+border)
 *  - off + hover      : card/50 (아주 옅은 오버레이)
 *  - on (pressed)     : secondary/64 회색 채움 (Figma `muted`#e2e8f0 = 프로젝트 secondary 토큰)
 *  - disabled         : opacity 50%
 *
 * 변형: `variant` Default(테두리 없음) / Outline(border+card+shadow), `size` sm/md/lg(28/32/36),
 *       `iconOnly`(정사각 패딩). 텍스트/아이콘 색은 foreground(#1d293d).
 *
 * @see https://coss.com/ui/docs/components/toggle
 */
const toggleVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1 rounded-radius-lg text-sm text-foreground transition-colors outline-none " +
    "focus-visible:ring-[3px] focus-visible:ring-offset-0 focus-visible:ring-disabled/[0.07] " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "data-[state=off]:hover:bg-card/50 data-[state=on]:bg-secondary/[0.64] " +
    "[&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // 두 변형 모두 1px 테두리를 둬서 정렬/크기가 흔들리지 않게 한다(Default 는 투명 테두리).
        default: "border border-transparent",
        outline: "border border-border bg-card shadow-xs",
      },
      size: {
        sm: "h-7 px-1.5",
        md: "h-8 px-2",
        lg: "h-9 px-2.5",
      },
      iconOnly: {
        true: "px-0",
        false: "",
      },
    },
    compoundVariants: [
      { iconOnly: true, size: "sm", class: "w-7" },
      { iconOnly: true, size: "md", class: "w-8" },
      { iconOnly: true, size: "lg", class: "w-9" },
    ],
    defaultVariants: { variant: "default", size: "md", iconOnly: false },
  }
);

export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">,
    VariantProps<typeof toggleVariants> {
  /** 눌림(켜짐) 상태 — Figma State=Active. 제어 컴포넌트로 쓸 때 사용. */
  pressed?: boolean;
  /** 비제어 초기 눌림 상태 */
  defaultPressed?: boolean;
  /** 눌림 상태가 바뀔 때 호출 */
  onPressedChange?: (pressed: boolean) => void;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      className,
      variant,
      size,
      iconOnly,
      pressed,
      defaultPressed = false,
      onPressedChange,
      onClick,
      ...props
    },
    ref
  ) => {
    const isControlled = pressed !== undefined;
    const [internal, setInternal] = React.useState(defaultPressed);
    const isOn = isControlled ? pressed : internal;

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={isOn}
        data-state={isOn ? "on" : "off"}
        className={cn(toggleVariants({ variant, size, iconOnly }), className)}
        onClick={(e) => {
          if (!isControlled) setInternal((v) => !v);
          onPressedChange?.(!isOn);
          onClick?.(e);
        }}
        data-node-id="5685:204"
        {...props}
      />
    );
  }
);
Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
