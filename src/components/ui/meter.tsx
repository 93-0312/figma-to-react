import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Meter — Figma "BO UI Kit" Meter 컴포넌트(node 7664:31)를 옮긴 수치 표시 막대.
 *
 * 범위(min~max) 안에서 현재 값을 막대로 보여준다(디스크 사용량·점수 등). 진행 상태가
 * 아니라 "정적 측정값"이므로 role="meter" + aria-value* 로 접근성을 갖춘다.
 *
 * 구조: [라벨행: label · valueLabel] + [트랙(input) + 인디케이터(primary)].
 * 변형(Figma): showLabels / showSecondaryLabel(우측 X% 라벨). 채움 비율 = (value-min)/(max-min).
 *
 * @see https://coss.com/ui/docs/components/meter
 */
export interface MeterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 현재 값 (min~max 범위 안). 기본 0~100 */
  value?: number;
  /** 범위 최소 (기본 0) */
  min?: number;
  /** 범위 최대 (기본 100) */
  max?: number;
  /** 좌측 라벨 텍스트 */
  label?: string;
  /** 우측 보조 라벨(예: "50%"). 미지정 시 채움 비율을 % 로 자동 표기 */
  valueLabel?: string;
  /** 라벨 행 표시 여부 */
  showLabels?: boolean;
  /** 우측 보조 라벨 표시 여부 */
  showSecondaryLabel?: boolean;
}

const Meter = React.forwardRef<HTMLDivElement, MeterProps>(
  (
    {
      className,
      value = 50,
      min = 0,
      max = 100,
      label = "Label",
      valueLabel,
      showLabels = true,
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
        role="meter"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        className={cn("flex w-full flex-col gap-2", className)}
        data-node-id="7664:31"
        {...props}
      >
        {showLabels ? (
          <div className="flex items-center justify-between">
            {label != null ? (
              <span className="text-xs font-medium text-foreground">{label}</span>
            ) : null}
            {showSecondaryLabel ? (
              <span className="text-xs font-medium text-foreground">
                {valueLabel ?? `${Math.round(pct)}%`}
              </span>
            ) : null}
          </div>
        ) : null}
        <div className="relative h-2 w-full overflow-hidden bg-input" data-node-id="7664:42">
          <div
            className="absolute inset-y-0 left-0 bg-primary transition-[width]"
            style={{ width: `${pct}%` }}
            data-node-id="7664:44"
          />
        </div>
      </div>
    );
  }
);
Meter.displayName = "Meter";

export { Meter };
