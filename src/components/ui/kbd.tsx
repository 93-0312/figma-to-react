import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Kbd — Figma "BO UI Kit" Kbd 컴포넌트 세트(node 7658:2132). 키보드 키 캡 표시.
 *
 * Figma variant → prop 매핑 (평탄화 없이 1:1):
 * - `Background`(True/False) → `background` (기본 true) — 배경 칩(bg-accent) 유무
 * - `IsIcon`(False/True) → `isIcon` (기본 false) — 내용이 아이콘일 때 패딩 전환
 * - `Label#7658:20`(TEXT) / `Icon#7658:17`(INSTANCE_SWAP) → `children` (텍스트 또는 14px 아이콘)
 *
 * 상태 진리표 (2^2 전 조합, Figma 세트와 동일):
 * | isIcon | background | 렌더 |
 * |---|---|---|
 * | false | true  | accent 칩 + 텍스트, px-1 py-px |
 * | true  | true  | accent 칩 + 14px 아이콘, p-px |
 * | false | false | 배경 없음 + 텍스트, px-1 py-px |
 * | true  | false | 배경 없음 + 14px 아이콘, p-px |
 *
 * 텍스트/아이콘 색: Figma #686f7a(전용 변수 9705:87967)는 코드 토큰에 없어
 * 가장 가까운 `text-muted-foreground`(#0f172b@50%) 로 근사.
 */
const kbdVariants = cva(
  "inline-flex h-5 min-w-5 select-none items-center justify-center rounded-radius-sm text-xs font-medium leading-4 text-muted-foreground [&_svg]:size-3.5",
  {
    variants: {
      background: {
        true: "bg-accent",
        false: "",
      },
      isIcon: {
        true: "p-px",
        false: "px-1 py-px",
      },
    },
    defaultVariants: {
      background: true,
      isIcon: false,
    },
  }
);

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, background, isIcon, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(kbdVariants({ background, isIcon }), className)}
      data-node-id="7658:2132"
      {...props}
    />
  )
);
Kbd.displayName = "Kbd";

export { Kbd, kbdVariants };
