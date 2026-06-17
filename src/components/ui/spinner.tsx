import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Spinner — Figma "BO UI Kit" Spinner(node 7707:393). 로딩 인디케이터.
 *
 * Figma 의 회전 프레임(이미지 에셋)은 7일 만료라 라이브러리 영구성을 위해 **인라인 SVG 링 +
 * `animate-spin`** 으로 그린다(색은 currentColor 상속). size sm/md/lg(16/24/32).
 */
const spinnerVariants = cva("animate-spin", {
  variants: {
    size: { sm: "size-4", md: "size-6", lg: "size-8" },
  },
  defaultVariants: { size: "md" },
});

export interface SpinnerProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="로딩 중"
      data-node-id="7707:393"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" className="opacity-20" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
