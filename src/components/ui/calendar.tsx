import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Button } from "./button";

/**
 * Calendar — Figma "BO UI Kit" Calendar(node 7953:3826) + 내부 부품
 * .CalendarDate(7950:485) / .MiddleCalendarElement(7953:147) / .CalendarHeader(7950:18358).
 *
 * 날짜 계산은 내장 `Date` 만 사용(외부 라이브러리 없음).
 *
 * Figma variant 1:1 매핑:
 *  - Calendar `WithPresets`(BOOLEAN)            → `withPresets` prop (프리셋 열 + 세로 구분선)
 *  - .MiddleCalendarElement `Type`(String/Inputs) → `monthYearControl`("string" | "inputs")
 *  - .CalendarDate `Type`(8종)                   → 셀 상태(아래 진리표), `Number`(TEXT) → 날짜 숫자,
 *    `IsToday?`(BOOLEAN) → 숫자 아래 3px 점(dot), `Selectable?`(True/False) → 클릭 가능 여부
 *
 * .CalendarDate 상태 진리표(Figma 에 존재하는 8개 variant 전수):
 *  | Type      | Selectable? | 렌더 (토큰)                                                  |
 *  |-----------|-------------|--------------------------------------------------------------|
 *  | Default   | True        | 투명 배경, text-foreground(#212226) 14px, r=10               |
 *  | Muted     | False       | 요일 헤더 전용 — text-muted-foreground(#0f172b@50%) 12px 500, 셀 opacity 70%, 클릭 불가 |
 *  | Hover     | True        | bg-accent(#eff2f7) + text-accent-foreground(#2b7fff), r=10 — CSS `:hover` 로 재현 |
 *  | Selected  | True        | bg-primary(#2b7fff) + text-primary-foreground(흰색), r=10    |
 *  | Range     | True        | 범위 중간 — bg-accent + text-accent-foreground, 모서리 r=0   |
 *  | RangeLeft | True        | 범위 시작 — bg-primary + 흰 텍스트, 좌측만 r=10              |
 *  | RangeRight| True        | 범위 끝  — bg-primary + 흰 텍스트, 우측만 r=10               |
 *  | NextMonth | True        | 바깥(다음 달) 날짜 — text-muted-foreground 14px, 셀 opacity 70%, 클릭 시 해당 달로 이동·선택 |
 *  - `IsToday?`=True 는 어느 Type 과도 조합 가능 — 숫자 아래 중앙(bottom 5px)에 3×3 점을
 *    현재 텍스트 색(bg-current)으로 표시(Selected 위에서는 흰 점 — Figma 렌더 확인).
 *  - 이전 달 날짜는 Figma 에 별도 variant 가 없어 NextMonth 스타일을 공유(보고 사항).
 *  - 비활성 날짜(`isDateDisabled`)는 Figma 에 전용 variant 가 없어 Selectable?=False 의
 *    의미(클릭 불가) + Muted 의 시각 토큰을 차용(보고 사항).
 *
 * 접근성: role=grid / row / columnheader / gridcell, aria-selected, aria-current="date"(오늘),
 * aria-disabled. roving tabindex + 화살표(±1일/±7일), Home/End(주 시작/끝), PageUp/Down(±1개월).
 *
 * 토큰: 컨테이너 border-border + rounded-radius-2xl(16) + p-2 + bg-card,
 *       구분선 bg-border, 헤더 텍스트 text-sm(14/20 w400) text-foreground.
 */
export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface CalendarPreset {
  label: React.ReactNode;
  /** 오늘 기준 상대 일수 (Today=0, Tomorrow=1 …) */
  days: number;
}

/** Figma 프리셋 기본값: Today / Tomorrow / In 3 days / In a week */
export const DEFAULT_CALENDAR_PRESETS: CalendarPreset[] = [
  { label: "Today", days: 0 },
  { label: "Tomorrow", days: 1 },
  { label: "In 3 days", days: 3 },
  { label: "In a week", days: 7 },
];

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_NAMES_SHORT = MONTH_NAMES.map((m) => m.slice(0, 3));

/* ---------- 날짜 유틸(내장 Date 만) ---------- */
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const isSameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a && !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth() + n, 1);
const isSameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/* ---------- .CalendarDate 셀(프레젠테이션) ---------- */
const calendarDateVariants = cva(
  "relative flex size-9 shrink-0 select-none items-center justify-center outline-none",
  {
    variants: {
      /** Figma .CalendarDate `Type` 1:1 */
      cell: {
        default: "rounded-radius text-sm text-foreground",
        muted: "rounded-radius text-xs font-medium text-muted-foreground opacity-70",
        hover: "rounded-radius bg-accent text-sm text-accent-foreground",
        selected: "rounded-radius bg-primary text-sm text-primary-foreground",
        range: "rounded-none bg-accent text-sm text-accent-foreground",
        rangeLeft: "rounded-l-radius rounded-r-none bg-primary text-sm text-primary-foreground",
        rangeRight: "rounded-r-radius rounded-l-none bg-primary text-sm text-primary-foreground",
        nextMonth: "rounded-radius text-sm text-muted-foreground opacity-70",
      },
    },
    defaultVariants: { cell: "default" },
  }
);

export interface CalendarDateCellProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof calendarDateVariants> {
  /** Figma `IsToday?` — 숫자 아래 3px 점 */
  isToday?: boolean;
  /** Figma `Selectable?` — false 면 비인터랙티브(요일 헤더/비활성 날짜) */
  selectable?: boolean;
}

/**
 * .CalendarDate(7950:485) 단일 셀 — Calendar 내부에서 쓰이며,
 * 스토리 갤러리에서 variant 매트릭스 시각 회귀용으로도 export.
 */
const CalendarDateCell = React.forwardRef<HTMLButtonElement, CalendarDateCellProps>(
  ({ className, cell, isToday = false, selectable = true, tabIndex, children, ...props }, ref) => {
    const interactive = selectable && (cell === "default" || cell === "nextMonth" || cell == null);
    return (
      <button
        ref={ref}
        type="button"
        tabIndex={selectable ? tabIndex : -1}
        disabled={!selectable}
        data-node-id="7950:485"
        className={cn(
          calendarDateVariants({ cell }),
          interactive &&
            "transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
          !selectable && "cursor-default",
          className
        )}
        {...props}
      >
        {children}
        {isToday && (
          <span
            aria-hidden
            className="absolute bottom-[5px] left-1/2 size-[3px] -translate-x-1/2 rounded-radius-full bg-current"
          />
        )}
      </button>
    );
  }
);
CalendarDateCell.displayName = "CalendarDateCell";

/* ---------- 아이콘 (인라인 SVG, currentColor) ---------- */
function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-[18px]" aria-hidden>
      <path
        fillRule="evenodd"
        d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-[18px]" aria-hidden>
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
function ChevronUpDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={cn("size-4", className)} aria-hidden>
      <path
        fillRule="evenodd"
        d="M10.53 3.47a.75.75 0 0 0-1.06 0L6.22 6.72a.75.75 0 0 0 1.06 1.06L10 5.06l2.72 2.72a.75.75 0 1 0 1.06-1.06l-3.25-3.25Zm-4.31 9.81 3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 1 0-1.06-1.06L10 14.94l-2.72-2.72a.75.75 0 0 0-1.06 1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export interface CalendarProps {
  /** 선택 모드 — single(기본) 또는 range(.CalendarDate Range/RangeLeft/RangeRight variant) */
  mode?: "single" | "range";
  /** single 모드 제어 값 */
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date) => void;
  /** range 모드 제어 값 */
  rangeValue?: DateRange;
  defaultRangeValue?: DateRange;
  onRangeChange?: (range: DateRange) => void;
  /** 표시 월(제어). 해당 월의 아무 날짜나 전달 */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** Figma `WithPresets` — 좌측 프리셋 열 표시 (기본 true) */
  withPresets?: boolean;
  presets?: CalendarPreset[];
  /** Figma .MiddleCalendarElement `Type` — "string"(텍스트) | "inputs"(월/년 셀렉트) */
  monthYearControl?: "string" | "inputs";
  /** 비활성(선택 불가) 날짜 판정 — Figma Selectable?=False 매핑 */
  isDateDisabled?: (date: Date) => boolean;
  /** 오늘 날짜 주입(시각 테스트/스토리용, 기본 new Date()) */
  today?: Date;
  weekdayLabels?: string[];
  className?: string;
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      mode = "single",
      value,
      defaultValue = null,
      onValueChange,
      rangeValue,
      defaultRangeValue,
      onRangeChange,
      month,
      defaultMonth,
      onMonthChange,
      withPresets = true,
      presets = DEFAULT_CALENDAR_PRESETS,
      monthYearControl = "string",
      isDateDisabled,
      today: todayProp,
      weekdayLabels = WEEKDAY_LABELS,
      className,
    },
    ref
  ) => {
    const today = React.useMemo(
      () => startOfDay(todayProp ?? new Date()),
      [todayProp]
    );

    // 선택 상태 (single / range 각각 제어·비제어)
    const isValueControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState<Date | null>(defaultValue);
    const selected = isValueControlled ? (value ?? null) : internalValue;

    const isRangeControlled = rangeValue !== undefined;
    const [internalRange, setInternalRange] = React.useState<DateRange>(
      defaultRangeValue ?? {}
    );
    const range = isRangeControlled ? (rangeValue ?? {}) : internalRange;

    // 표시 월
    const isMonthControlled = month !== undefined;
    const [internalMonth, setInternalMonth] = React.useState<Date>(() =>
      addMonths(defaultMonth ?? selected ?? range.from ?? today, 0)
    );
    const viewMonth = isMonthControlled ? addMonths(month as Date, 0) : internalMonth;
    const setViewMonth = (m: Date) => {
      if (!isMonthControlled) setInternalMonth(m);
      onMonthChange?.(m);
    };

    // 키보드 포커스 대상 날짜(roving tabindex)
    const [focusedDate, setFocusedDate] = React.useState<Date>(
      () => selected ?? range.from ?? today
    );
    const focusPendingRef = React.useRef(false);
    const gridRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      if (!focusPendingRef.current) return;
      focusPendingRef.current = false;
      gridRef.current
        ?.querySelector<HTMLButtonElement>(`[data-date="${toKey(focusedDate)}"]`)
        ?.focus();
    }, [focusedDate, viewMonth]);

    const selectDate = (d: Date) => {
      if (isDateDisabled?.(d)) return;
      if (!isSameMonth(d, viewMonth)) setViewMonth(addMonths(d, 0));
      setFocusedDate(d);
      if (mode === "range") {
        let next: DateRange;
        if (!range.from || (range.from && range.to)) next = { from: d };
        else if (d < range.from) next = { from: d, to: range.from };
        else next = { from: range.from, to: d };
        if (!isRangeControlled) setInternalRange(next);
        onRangeChange?.(next);
      } else {
        if (!isValueControlled) setInternalValue(d);
        onValueChange?.(d);
      }
    };

    const moveFocus = (next: Date) => {
      if (!isSameMonth(next, viewMonth)) setViewMonth(addMonths(next, 0));
      focusPendingRef.current = true;
      setFocusedDate(next);
    };

    const onGridKeyDown = (e: React.KeyboardEvent) => {
      const map: Record<string, () => Date> = {
        ArrowLeft: () => addDays(focusedDate, -1),
        ArrowRight: () => addDays(focusedDate, 1),
        ArrowUp: () => addDays(focusedDate, -7),
        ArrowDown: () => addDays(focusedDate, 7),
        Home: () => addDays(focusedDate, -focusedDate.getDay()),
        End: () => addDays(focusedDate, 6 - focusedDate.getDay()),
        // ±1개월 — 대상 월의 말일을 넘지 않게 clamp (예: 1/31 → 2/28)
        PageUp: () => {
          const last = new Date(focusedDate.getFullYear(), focusedDate.getMonth(), 0).getDate();
          return new Date(focusedDate.getFullYear(), focusedDate.getMonth() - 1, Math.min(focusedDate.getDate(), last));
        },
        PageDown: () => {
          const last = new Date(focusedDate.getFullYear(), focusedDate.getMonth() + 2, 0).getDate();
          return new Date(focusedDate.getFullYear(), focusedDate.getMonth() + 1, Math.min(focusedDate.getDate(), last));
        },
      };
      const fn = map[e.key];
      if (!fn) return;
      e.preventDefault();
      moveFocus(fn());
    };

    // 그리드 날짜 계산: 일요일 시작, Figma 처럼 해당 월에 필요한 주 수만 렌더
    const monthStart = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
    const offset = monthStart.getDay();
    const weekCount = Math.ceil((offset + daysInMonth) / 7);
    const weeks: Date[][] = Array.from({ length: weekCount }, (_, w) =>
      Array.from({ length: 7 }, (_, i) => addDays(monthStart, w * 7 + i - offset))
    );

    // 셀 상태 결정 (진리표 — JSDoc 참고)
    const cellType = (d: Date): NonNullable<CalendarDateCellProps["cell"]> => {
      if (mode === "range") {
        const { from, to } = range;
        if (from && to && isSameDay(from, to) && isSameDay(d, from)) return "selected";
        if (from && isSameDay(d, from)) return to ? "rangeLeft" : "selected";
        if (to && isSameDay(d, to)) return "rangeRight";
        if (from && to && d > from && d < to) return "range";
      } else if (isSameDay(d, selected)) {
        return "selected";
      }
      if (!isSameMonth(d, viewMonth)) return "nextMonth";
      return "default";
    };

    const monthLabel = `${MONTH_NAMES[viewMonth.getMonth()]} ${viewMonth.getFullYear()}`;
    const yearOptions = React.useMemo(() => {
      const y = viewMonth.getFullYear();
      const years: number[] = [];
      for (let i = y - 10; i <= y + 10; i++) years.push(i);
      return years;
    }, [viewMonth]);

    // .MiddleCalendarElement Type=Inputs 의 소형 셀렉트(월/년) — Input 토큰 재사용
    const miniSelectClass =
      "h-8 w-[76px] cursor-pointer appearance-none rounded-radius border border-input bg-card py-1.5 pl-2 pr-7 text-sm text-foreground shadow-xs outline-none transition-colors " +
      "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-offset-0 focus-visible:ring-ring/[0.15]";

    return (
      <div
        ref={ref}
        data-node-id="7953:3826"
        className={cn(
          "inline-flex rounded-radius-2xl border border-border bg-card p-2",
          className
        )}
      >
        {withPresets && (
          <>
            {/* Presets 열: pad 4/12/4/4, 버튼 = Button Ghost/Small(r=8) 좌측 정렬 */}
            <div className="flex w-[102px] flex-col py-1 pl-1 pr-3">
              {presets.map((p, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start !rounded-radius-lg font-medium"
                  onClick={() => selectDate(addDays(today, p.days))}
                >
                  {p.label}
                </Button>
              ))}
            </div>
            {/* 세로 Separator(#e6eaf0), pad 4/8/4/0 */}
            <div className="mr-2 flex flex-col py-1">
              <div className="w-px flex-1 bg-border" />
            </div>
          </>
        )}

        <div className="flex w-[252px] flex-col">
          {/* .CalendarHeader: [이전 달] [월 표시] [다음 달] */}
          <div className="flex h-9 items-center justify-between py-[2px]">
            <Button
              variant="ghost"
              size="md"
              aria-label="Previous month"
              className="opacity-80"
              icon={<ChevronLeftIcon />}
              onClick={() => {
                const next = addMonths(viewMonth, -1);
                setViewMonth(next);
                setFocusedDate(next);
              }}
            />
            {monthYearControl === "inputs" ? (
              /* .MiddleCalendarElement Type=Inputs — 월/년 셀렉트 (Figma: Input Small "Feb"/"2026" + chevron-up-down) */
              <div className="flex items-center gap-1.5">
                <span className="relative inline-flex">
                  <select
                    aria-label="Month"
                    className={miniSelectClass}
                    value={viewMonth.getMonth()}
                    onChange={(e) =>
                      setViewMonth(new Date(viewMonth.getFullYear(), Number(e.target.value), 1))
                    }
                  >
                    {MONTH_NAMES_SHORT.map((m, i) => (
                      <option key={m} value={i}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <ChevronUpDownIcon className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-80" />
                </span>
                <span className="relative inline-flex">
                  <select
                    aria-label="Year"
                    className={miniSelectClass}
                    value={viewMonth.getFullYear()}
                    onChange={(e) =>
                      setViewMonth(new Date(Number(e.target.value), viewMonth.getMonth(), 1))
                    }
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <ChevronUpDownIcon className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-80" />
                </span>
              </div>
            ) : (
              /* .MiddleCalendarElement Type=String — "March 2026" (14/20 w400 foreground) */
              <div aria-live="polite" className="text-sm font-normal text-foreground">
                {monthLabel}
              </div>
            )}
            <Button
              variant="ghost"
              size="md"
              aria-label="Next month"
              className="opacity-80"
              icon={<ChevronRightIcon />}
              onClick={() => {
                const next = addMonths(viewMonth, 1);
                setViewMonth(next);
                setFocusedDate(next);
              }}
            />
          </div>

          {/* 날짜 그리드: 요일 헤더(Muted) + 주 단위 행, 행 간격 1px */}
          <div
            ref={gridRef}
            role="grid"
            aria-label={monthLabel}
            className="flex flex-col gap-px"
            onKeyDown={onGridKeyDown}
          >
            <div role="row" className="flex">
              {weekdayLabels.map((w) => (
                <div
                  key={w}
                  role="columnheader"
                  className={cn(calendarDateVariants({ cell: "muted" }))}
                >
                  {w}
                </div>
              ))}
            </div>
            {weeks.map((week, wi) => (
              <div role="row" key={wi} className="flex">
                {week.map((d) => {
                  const disabled = isDateDisabled?.(d) ?? false;
                  const cell = cellType(d);
                  const isSelectedish =
                    cell === "selected" || cell === "rangeLeft" || cell === "rangeRight";
                  return (
                    <CalendarDateCell
                      key={toKey(d)}
                      role="gridcell"
                      data-date={toKey(d)}
                      cell={disabled ? "muted" : cell}
                      selectable={!disabled}
                      isToday={isSameDay(d, today)}
                      aria-selected={isSelectedish || cell === "range"}
                      aria-current={isSameDay(d, today) ? "date" : undefined}
                      aria-disabled={disabled || undefined}
                      aria-label={`${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`}
                      tabIndex={isSameDay(d, focusedDate) ? 0 : -1}
                      onClick={() => selectDate(d)}
                      onFocus={() => setFocusedDate(d)}
                    >
                      {d.getDate()}
                    </CalendarDateCell>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
Calendar.displayName = "Calendar";

export { Calendar, CalendarDateCell, calendarDateVariants };
