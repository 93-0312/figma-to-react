import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Progress — Figma "BO UI Kit" Progress 컴포넌트(node 7673:96). 진행 상태 막대.
 *
 * Meter(7664:31)와 구분: Meter 는 "정적 측정값"(role="meter", h-2 각진 트랙, destructive
 * 인디케이터)이고, Progress 는 "진행 중인 작업"(role="progressbar", h-1.5 rounded-full 트랙,
 * primary 인디케이터, 라벨 12px)을 나타낸다.
 *
 * 구조(Figma): [LabelRow: Label(12px/16 w500) ↔ "X%" (space-between)] + [.ProgressBar:
 * ProgressTrack(bg accent, radius full) + Indicator(bg primary)] 세로 gap 8.
 *
 * Figma 프로퍼티 → prop 매핑:
 * - `ShowLabelRow#7673:0`(BOOLEAN) → `showLabelRow`
 * - `ShowSecondaryLabel#7673:1`(BOOLEAN) → `showSecondaryLabel`
 * - ProgressBar `Percentage`(=50 기본) → `value` (기본 50)
 *
 * 상태 진리표:
 * | showLabelRow | showSecondaryLabel | 렌더 |
 * |---|---|---|
 * | true  | true  | 좌 라벨 + 우 % 라벨 + 트랙 |
 * | true  | false | 좌 라벨만 + 트랙 |
 * | false | *     | 트랙만 (라벨 행 전체 숨김) |
 */
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 진행률 (min~max 범위). 기본 50 (Figma Percentage=50) */
  value?: number;
  /** 범위 최소 (기본 0) */
  min?: number;
  /** 범위 최대 (기본 100) */
  max?: number;
  /** 좌측 라벨 텍스트 */
  label?: string;
  /** 우측 보조 라벨(예: "50%"). 미지정 시 진행 비율을 % 로 자동 표기 */
  valueLabel?: string;
  /** 라벨 행 표시 여부 (Figma ShowLabelRow) */
  showLabelRow?: boolean;
  /** 우측 보조 라벨 표시 여부 (Figma ShowSecondaryLabel) */
  showSecondaryLabel?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 50,
      min = 0,
      max = 100,
      label,
      valueLabel,
      showLabelRow = true,
      showSecondaryLabel = true,
      ...props
    },
    ref
  ) => {
    const span = max - min || 1;
    const pct = Math.min(100, Math.max(0, ((value - min) / span) * 100));
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        className={cn("flex w-full flex-col gap-2", className)}
        data-node-id="7673:96"
        {...props}
      >
        {showLabelRow ? (
          <div className="flex items-center justify-between">
            {label != null ? (
              <span className="py-px text-xs font-medium leading-4 text-foreground">
                {label}
              </span>
            ) : null}
            {showSecondaryLabel ? (
              <span className="py-px text-xs font-medium leading-4 text-foreground">
                {valueLabel ?? `${Math.round(pct)}%`}
              </span>
            ) : null}
          </div>
        ) : null}
        <div
          className="relative h-1.5 w-full overflow-hidden rounded-radius-full bg-accent"
          data-node-id="7669:1682"
        >
          <div
            className="absolute inset-y-0 left-0 bg-primary transition-[width]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
