import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Toggle — Figma "BO UI Kit" Toggle 컴포넌트(node 5685:204)를 옮긴 2-state 버튼.
 *
 * Figma 변형(2026-06-16 갱신): hover 가 예전엔 `State` 한 축에 묶여 있었으나 디자이너가
 * **별도 축 `IsHovered`(True/False)** 로 분리 → `State`(Default/Active/Disabled) × `IsHovered`.
 * 이는 우리가 처음부터 hover 를 직교 CSS `:hover` 로 다룬 매핑과 1:1 로 맞는다(코드 동작 불변).
 * 상호작용/의미를 평탄화하지 않고 매핑:
 *  - `pressed`(boolean) → `State=Active`(눌림/켜짐). aria-pressed + data-state=on.
 *  - `:hover`           → `IsHovered=True` (CSS — off 일 때만 배경 변화)
 *  - `disabled`         → `State=Disabled`(CSS)
 *  - 기본               → `State=Default`
 *
 * 상태 진리표(배경/텍스트):
 *  - off                : 배경 투명, 텍스트/아이콘 foreground(#1d293d) (outline 변형은 card+border)
 *  - off + hover        : 배경 card/50 (아주 옅은 오버레이), 텍스트 foreground
 *  - on (pressed)       : 배경 accent 채움(Figma 자체 바인딩은 VariableID:5632:2344 이나 값이
 *                         프로젝트 accent 토큰과 가까워 accent 재사용 — 2026-07-13 갱신 후 #eff6ff,
 *                         accent 는 #eff2f7 로 근사, 2026-07-14 갱신),
 *                         텍스트/아이콘 accent-foreground(#2b7fff = primary, VariableID:5632:2345)
 *  - on + hover         : on 과 동일(Figma Active+IsHovered=True 도 동일 — 호버로 안 바뀜)
 *  - disabled (+hover)  : opacity 50% (disabled 는 pointer-events-none 이라 hover 미발동)
 *
 * 변형: `variant` Default(테두리 없음) / Outline(border+card+shadow), `size` sm/md/lg(28/32/36),
 *       `iconOnly`(정사각 패딩).
 *
 * @see https://coss.com/ui/docs/components/toggle
 */
const toggleVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1 rounded-radius-lg text-sm text-foreground transition-colors outline-none " +
    "focus-visible:ring-[3px] focus-visible:ring-offset-0 focus-visible:ring-disabled/[0.07] " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "data-[state=off]:hover:bg-card/50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground " +
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
