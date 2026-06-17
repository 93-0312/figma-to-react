import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Button — Figma "BO UI Kit" Button 컴포넌트(node 1692:74)를 옮긴 React 컴포넌트.
 *
 * 7가지 타입(Default/Outline/Secondary/Destructive/DestructiveTinted/Link/Ghost) × 5가지 사이즈
 * 매트릭스를 그대로 재현하며, 모든 색상/간격/타이포는
 * Tailwind config(= Figma 디자인 토큰)에 매핑돼 하드코딩을 최소화했다.
 * 좌/우 아이콘 슬롯(icon, rightIcon)을 지원한다.
 *
 * @see https://coss.com/ui/docs/components/button
 */
const buttonVariants = cva(
  // 공통: gap-0 + 라벨 자체 padding 으로 Figma 의 LabelFrame 구조를 재현
  "inline-flex shrink-0 items-center justify-center gap-0 whitespace-nowrap border font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground shadow-btn hover:bg-primary/90",
        outline:
          "border-border bg-card text-foreground shadow-xs hover:bg-secondary/50",
        secondary:
          "border-transparent bg-secondary text-foreground hover:bg-secondary/80",
        destructive:
          "border-border bg-destructive text-primary-foreground shadow-btn hover:bg-destructive/90",
        "destructive-tinted":
          "border-transparent bg-destructive/[0.08] text-destructive-foreground hover:bg-destructive/[0.12]",
        ghost:
          "border-transparent bg-transparent text-foreground hover:bg-secondary",
        link: "border-transparent bg-transparent text-foreground underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-6 min-w-6 rounded-radius-lg px-1 text-xs [&_svg]:size-4",
        sm: "h-7 min-w-7 rounded-radius px-1.5 text-sm [&_svg]:size-4",
        md: "h-8 min-w-8 rounded-radius px-1.5 text-sm [&_svg]:size-[18px]",
        lg: "h-9 min-w-9 rounded-radius px-2 text-sm [&_svg]:size-5 [&_[data-label]]:px-1.5",
        xl: "h-10 min-w-10 rounded-radius px-2.5 text-base [&_svg]:size-5 [&_[data-label]]:px-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** 좌측 아이콘 (예: <PlusIcon />) */
  icon?: React.ReactNode;
  /** 우측 아이콘 */
  rightIcon?: React.ReactNode;
  /** 알약(rounded-full) 형태 — Figma PillButton 변형 */
  pill?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, type = "button", icon, rightIcon, pill, children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          buttonVariants({ variant, size }),
          pill && "!rounded-radius-full",
          className
        )}
        data-node-id="1692:74"
        {...props}
      >
        {icon ? (
          <span className="inline-flex shrink-0 opacity-80">{icon}</span>
        ) : null}
        {children != null ? <span data-label className="px-1">{children}</span> : null}
        {rightIcon ? (
          <span className="inline-flex shrink-0 opacity-80">{rightIcon}</span>
        ) : null}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
