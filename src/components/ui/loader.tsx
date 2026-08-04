import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Loader — Figma "BO UI Kit" Loader 컴포넌트 세트(node 9942:43552). 로딩/진행 인디케이터.
 *
 * Figma variant → prop 매핑 (평탄화 없이 1:1):
 * - `Determinate`(False/True) → `determinate` (기본 false)
 * - `Size`(Medium/Large) → `size` ("md" 24px / "lg" 48px, 기본 "md")
 *
 * 상태 진리표 (2^2 전 조합, Figma 세트와 동일):
 * | determinate | size | 렌더 |
 * |---|---|---|
 * | false | md | 24px, 8분할 세그먼트 스피너(불투명도 1→0.02 페이드) + steps(8) 회전 |
 * | false | lg | 48px, 동일 세그먼트 스피너 ×2 스케일 |
 * | true  | md | 24px, currentColor 외곽 링(r9/두께2) + 내부 12px 파이(진행분 currentColor, 잔여분 border 토큰) |
 * | true  | lg | 48px, border 토큰 트랙 링(두께4) + currentColor 진행 아크(12시 시작, 시계방향) |
 *
 * 색: Figma 는 foreground(#212226) 변수 — currentColor 로 상속(기본 text-foreground).
 * 잔여 트랙 #e6eaf0(변수 5632:2356)은 값이 동일한 `--border` 토큰으로 매핑.
 * determinate 일 때 `value`(0~100)로 진행률을 제어한다(Figma 정적 도안은 75%).
 */
const loaderVariants = cva("shrink-0", {
  variants: {
    size: { md: "size-6", lg: "size-12" },
  },
  defaultVariants: { size: "md" },
});

/** Figma 세그먼트 불투명도(12시부터 시계방향): N 0.05, NE 0.1, E 0.2, SE 0.4, S 0.6, SW 0.8, W 1, NW 0.02 */
const SEGMENT_OPACITIES = [0.05, 0.1, 0.2, 0.4, 0.6, 0.8, 1, 0.02];

/** 12시 기준 시계방향 파이 섹터 path (frac 0~1) */
function pieSectorPath(cx: number, cy: number, r: number, frac: number): string {
  const angle = frac * 2 * Math.PI;
  const x = cx + r * Math.sin(angle);
  const y = cy - r * Math.cos(angle);
  const large = frac > 0.5 ? 1 : 0;
  return `M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${large} 1 ${x} ${y} Z`;
}

export interface LoaderProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof loaderVariants> {
  /** true 면 진행률 표시(determinate), false 면 무한 스피너 (Figma Determinate) */
  determinate?: boolean;
  /** 진행률 0~100 (determinate 일 때만 사용) */
  value?: number;
}

const Loader = React.forwardRef<SVGSVGElement, LoaderProps>(
  ({ className, size, determinate = false, value = 0, ...props }, ref) => {
    const frac = Math.min(100, Math.max(0, value)) / 100;

    if (!determinate) {
      return (
        <svg
          ref={ref}
          viewBox="0 0 24 24"
          fill="none"
          role="status"
          aria-label="로딩 중"
          data-node-id="9942:43552"
          className={cn(
            loaderVariants({ size }),
            "animate-[spin_0.8s_steps(8,end)_infinite]",
            className
          )}
          {...props}
        >
          {SEGMENT_OPACITIES.map((opacity, i) => (
            <line
              key={i}
              x1="12"
              y1="3"
              x2="12"
              y2="8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              opacity={opacity}
              transform={`rotate(${i * 45} 12 12)`}
            />
          ))}
        </svg>
      );
    }

    const progressProps = {
      role: "progressbar",
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Math.round(frac * 100),
    } as const;

    if (size === "lg") {
      // Large determinate: border 트랙 링 + currentColor 아크 (두께 4, 12시 시작)
      const r = 18;
      const circumference = 2 * Math.PI * r;
      return (
        <svg
          ref={ref}
          viewBox="0 0 48 48"
          fill="none"
          data-node-id="9942:43574"
          className={cn(loaderVariants({ size }), className)}
          {...progressProps}
          {...props}
        >
          <circle cx="24" cy="24" r={r} strokeWidth="4" className="stroke-border" />
          <circle
            cx="24"
            cy="24"
            r={r}
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={`${circumference * frac} ${circumference}`}
            transform="rotate(-90 24 24)"
          />
        </svg>
      );
    }

    // Medium determinate: currentColor 외곽 링 + 내부 파이(잔여분 border)
    return (
      <svg
        ref={ref}
        viewBox="0 0 24 24"
        fill="none"
        data-node-id="9942:43571"
        className={cn(loaderVariants({ size }), className)}
        {...progressProps}
        {...props}
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="6" className="fill-border" />
        {frac >= 1 ? (
          <circle cx="12" cy="12" r="6" fill="currentColor" />
        ) : frac > 0 ? (
          <path d={pieSectorPath(12, 12, 6, frac)} fill="currentColor" />
        ) : null}
      </svg>
    );
  }
);
Loader.displayName = "Loader";

export { Loader, loaderVariants };
