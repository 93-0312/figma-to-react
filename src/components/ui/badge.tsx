import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Badge — Figma "BO UI Kit" Badge(node 9929:48567). 상태/카테고리 라벨.
 *
 * Figma 변형: Color(blue/red/orange/green/neutral…) × Type(Fill/Tinted) × Disabled.
 *  - Fill  : 단색 채움(상태색) + 흰 텍스트
 *  - Tinted: 상태색 @8% 배경 + 상태색-foreground 텍스트
 * 색은 상태 토큰으로 매핑: blue→info(=primary), red→destructive, orange→warning,
 * green→success, neutral→foreground. (Figma static/secondary(dark) 변형은 미구현.)
 */
const badgeVariants = cva(
  "inline-flex h-5 items-center justify-center gap-1 rounded-radius-full px-2 py-0.5 text-xs font-medium leading-[14px] tracking-[0.12px] whitespace-nowrap",
  {
    variants: {
      color: {
        info: "",
        success: "",
        warning: "",
        destructive: "",
        neutral: "",
      },
      variant: { fill: "", tinted: "" },
    },
    compoundVariants: [
      { variant: "fill", color: "info", class: "bg-info text-primary-foreground" },
      { variant: "fill", color: "success", class: "bg-success text-primary-foreground" },
      { variant: "fill", color: "warning", class: "bg-warning text-primary-foreground" },
      { variant: "fill", color: "destructive", class: "bg-destructive text-primary-foreground" },
      { variant: "fill", color: "neutral", class: "bg-foreground text-background" },
      { variant: "tinted", color: "info", class: "bg-info/[0.08] text-info-foreground" },
      { variant: "tinted", color: "success", class: "bg-success/[0.08] text-success-foreground" },
      { variant: "tinted", color: "warning", class: "bg-warning/[0.08] text-warning-foreground" },
      { variant: "tinted", color: "destructive", class: "bg-destructive/[0.08] text-destructive-foreground" },
      { variant: "tinted", color: "neutral", class: "bg-foreground/[0.08] text-foreground" },
    ],
    defaultVariants: { color: "neutral", variant: "fill" },
  }
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, color, variant, ...props }, ref) => (
    <span
      ref={ref}
      data-node-id="9929:48567"
      className={cn(badgeVariants({ color, variant }), className)}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
