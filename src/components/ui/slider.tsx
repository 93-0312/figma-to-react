import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Slider — Figma "BO UI Kit" Slider(node 7706:12) + 내부 .SliderBar(7673:175).
 * 범위 내에서 값 하나를 고르는 입력.
 *
 * Figma variant 1:1 매핑:
 *  - `LabelTop`(True/False)     → `labelTop` prop — 라벨 행을 바 위(true)/아래(false)에 배치
 *  - `ShowLabelRow`(BOOLEAN)    → `showLabelRow` prop — 라벨 행 표시 여부
 *  - .SliderBar `Percentage`(0~100, 10 단위 variant) → 코드에선 연속값 `value`(min/max/step)로 일반화.
 *    Figma 의 11개 variant 는 채움 비율의 이산 표본일 뿐이므로 % 폭 계산으로 재현한다.
 *
 * 상태 진리표(LabelTop × ShowLabelRow):
 *  | LabelTop | ShowLabelRow | 렌더                        |
 *  |----------|--------------|-----------------------------|
 *  | True     | True         | [LabelRow] 위 + [SliderBar] |
 *  | True     | False        | [SliderBar] 만              |
 *  | False    | True         | [SliderBar] + [LabelRow] 아래|
 *  | False    | False        | [SliderBar] 만              |
 *
 * 구현 방식(결정 근거): Figma 구조가 "트랙(4px pill) + 채움 Indicator + 원형 Handler(14px)"의
 * 순수 시각 구조라 네이티브 `<input type="range">` 를 투명하게 위에 겹치고(전체 히트영역)
 * 그 아래에 커스텀 트랙/썸을 렌더한다 — CLAUDE.md 접근성 규칙("네이티브 요소 기반, 숨긴 input")
 * 그대로이며, 화살표/Home/End 키보드·폼 제출·스크린리더가 브라우저 기본으로 보장된다.
 *
 * 토큰: 트랙 bg-accent(#eff2f7) · 채움 bg-primary(#2b7fff) · 썸 bg-card + border-border(#e6eaf0)
 *       + shadow-xs · 라벨 text-xs(12px) font-medium text-foreground(#212226).
 *
 * @see https://coss.com/ui/docs/components/slider
 */
export interface SliderProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "value" | "defaultValue" | "onChange" | "type"
  > {
  /** 제어 값 */
  value?: number;
  /** 비제어 초기 값 */
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Figma `ShowLabelRow` — 라벨 행 표시 (기본 true) */
  showLabelRow?: boolean;
  /** Figma `LabelTop` — true 면 라벨 행이 바 위, false 면 아래 (기본 true) */
  labelTop?: boolean;
  /** 좌측(Primary) 라벨. Figma 기본 "Label" */
  label?: React.ReactNode;
  /**
   * 우측(Secondary) 라벨. Figma 기본 "X%".
   * 생략 시 현재 값의 범위 내 백분율(`{pct}%`)을 표시. 함수를 주면 현재 값으로 호출.
   */
  valueLabel?: React.ReactNode | ((value: number) => React.ReactNode);
  /** 루트(래퍼) 클래스 */
  className?: string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      value,
      defaultValue = 0,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      showLabelRow = true,
      labelTop = true,
      label = "Label",
      valueLabel,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState(defaultValue);
    const val = isControlled ? value : internal;
    const pct = max === min ? 0 : ((val - min) / (max - min)) * 100;

    const secondary =
      typeof valueLabel === "function"
        ? valueLabel(val)
        : valueLabel !== undefined
          ? valueLabel
          : `${Math.round(pct)}%`;

    // Figma LabelRow: 12px/16px 500, foreground, 양끝 정렬(SPACE_BETWEEN)
    const labelRow = showLabelRow ? (
      <div className="flex h-[18px] items-center justify-between">
        <span className="text-xs font-medium leading-4 text-foreground">
          {label}
        </span>
        <span className="text-xs font-medium leading-4 text-foreground">
          {secondary}
        </span>
      </div>
    ) : null;

    return (
      <div
        className={cn(
          "flex w-full flex-col gap-2",
          disabled && "opacity-[0.64]",
          className
        )}
        data-node-id="7706:12"
      >
        {labelTop && labelRow}
        {/* .SliderBar(7673:175): 트랙 4px pill + 채움 Indicator + Handler 14px */}
        <div className="relative flex h-3.5 w-full items-center">
          <div className="h-1 w-full overflow-hidden rounded-radius-full bg-accent">
            <div
              className="h-full rounded-l-radius-full bg-primary"
              style={{ width: `${pct}%` }}
            />
          </div>
          {/* Handler — Indicator 끝점에 중심 정렬(Figma 50% 표본에서 트랙 중앙에 정확히 위치) */}
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-radius-full border border-border bg-card shadow-xs"
            style={{ left: `${pct}%` }}
          />
          {/* 네이티브 range — 시각은 숨기고(불투명도 0) 조작/키보드/접근성 담당 */}
          <input
            ref={ref}
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={val}
            disabled={disabled}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (!isControlled) setInternal(n);
              onValueChange?.(n);
            }}
            className={cn(
              "absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0 outline-none",
              "disabled:cursor-not-allowed"
            )}
            {...props}
          />
          {/* 포커스 링 — 숨긴 input 이 focus-visible 일 때 썸 위치에 링 표시 */}
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 hidden size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-radius-full ring-2 ring-ring ring-offset-1 ring-offset-background [input:focus-visible~&]:block"
            style={{ left: `${pct}%` }}
          />
        </div>
        {!labelTop && labelRow}
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
