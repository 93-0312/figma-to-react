import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * SegmentedControl — Figma "BO UI Kit" Segmented Control(node 9705:88227). 단일 선택 세그먼트.
 *
 * 컨테이너(bg-accent, p-0.5) 안에 균등 너비 세그먼트. 선택 세그먼트만 bg-card + shadow(흰 알약),
 * 나머지는 muted-foreground 텍스트. Style: Rounded(rounded-full) / Regular(rounded-radius) / Sharp(rounded-none).
 * 제어/비제어(value/onValueChange). (Figma 의 다층 그림자는 shadow-xs 로 근사.)
 *
 * 접근성: radio-group.tsx 와 같은 숨긴 네이티브 `<input type=radio>` 방식 — 화살표 키 이동/선택,
 * 그룹 단위 Tab 스톱, 폼 시맨틱을 브라우저가 제공한다. 시각은 peer-* 로 input 상태를 반영.
 */
const containerVariants = cva(
  "inline-flex w-full items-center gap-0 bg-accent p-0.5",
  {
    variants: {
      segStyle: { rounded: "rounded-radius-full", regular: "rounded-radius", sharp: "rounded-none" },
    },
    defaultVariants: { segStyle: "rounded" },
  }
);
const segmentVariants = cva(
  "flex w-full items-center justify-center gap-1 px-3 py-2 text-sm font-medium transition-colors " +
    "peer-focus-visible:ring-[3px] peer-focus-visible:ring-offset-0 peer-focus-visible:ring-disabled/[0.07] peer-focus-visible:z-10 " +
    "peer-disabled:pointer-events-none peer-disabled:opacity-[0.64]",
  {
    variants: {
      segStyle: { rounded: "rounded-radius-full", regular: "rounded-radius-lg", sharp: "rounded-none" },
      active: {
        true: "bg-card text-foreground shadow-xs",
        false: "text-muted-foreground hover:text-foreground",
      },
    },
    defaultVariants: { segStyle: "rounded", active: false },
  }
);

export interface SegmentedOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof containerVariants> {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** 라디오 그룹 name (미지정 시 자동 생성) */
  name?: string;
}

const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  ({ className, options, value, defaultValue, onValueChange, segStyle, name, ...props }, ref) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState(defaultValue ?? options[0]?.value);
    const current = isControlled ? value : internal;
    const autoName = React.useId();
    const groupName = name ?? autoName;
    const select = (v: string) => {
      if (!isControlled) setInternal(v);
      onValueChange?.(v);
    };
    return (
      <div
        ref={ref}
        role="radiogroup"
        data-node-id="9705:88227"
        className={cn(containerVariants({ segStyle }), className)}
        {...props}
      >
        {options.map((opt) => {
          const active = opt.value === current;
          return (
            <label
              key={opt.value}
              className={cn("flex flex-1", opt.disabled ? "cursor-not-allowed" : "cursor-pointer")}
            >
              <input
                type="radio"
                name={groupName}
                value={opt.value}
                checked={active}
                disabled={opt.disabled}
                onChange={() => select(opt.value)}
                className="peer sr-only"
              />
              <span className={segmentVariants({ segStyle, active })}>{opt.label}</span>
            </label>
          );
        })}
      </div>
    );
  }
);
SegmentedControl.displayName = "SegmentedControl";

export { SegmentedControl, segmentVariants };
