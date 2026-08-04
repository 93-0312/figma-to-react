import * as React from "react";
import { cn } from "../../lib/utils";
import { Input, type InputProps } from "./input";
import { Calendar, type CalendarProps } from "./calendar";

/**
 * DatePicker — Figma "BO UI Kit" DatePicker(node 7954:7493).
 * Input 트리거(캘린더 아이콘 + 포맷된 날짜 + 셰브론) 아래에 Calendar 팝업이 뜨는 합성 컴포넌트.
 *
 * Figma 구조 1:1:
 *  - 트리거 = Input(7745:699) 인스턴스: LeftIcon=outline/calendar, RightIcon=mini/chevron-down,
 *    Label="February 18th, 2026"(기본 포맷) → 기존 Input 컴포넌트 재사용(readOnly).
 *  - 팝업 = Calendar(7953:3826) 인스턴스: fill 흰색(bg-card) + shadow-overlay
 *    (Figma DROP_SHADOW 0/4/6/-4 5% + 0/10/15/-3 5% = 기존 `shadow-overlay` 토큰과 동일값),
 *    트리거와 간격 4px(gap-1 → mt-1).
 *  - Calendar 의 `WithPresets`/`monthYearControl` 등은 그대로 전달.
 *
 * 동작: 클릭/Enter/Space/ArrowDown 으로 열림, 날짜 선택·바깥 클릭·Escape 로 닫힘
 * (닫힐 때 트리거로 포커스 복귀 — select.tsx 패턴). 제어/비제어 지원.
 * `name` 지정 시 hidden input 으로 ISO(yyyy-mm-dd) 값이 폼 제출에 실린다.
 *
 * 접근성: 트리거 aria-haspopup="dialog" + aria-expanded, 팝업 role="dialog".
 */
export interface DatePickerProps
  extends Pick<InputProps, "inputSize" | "invalid">,
    Pick<
      CalendarProps,
      "withPresets" | "presets" | "monthYearControl" | "isDateDisabled" | "today"
    > {
  /** 제어 값 */
  value?: Date | null;
  /** 비제어 초기 값 */
  defaultValue?: Date | null;
  onValueChange?: (date: Date) => void;
  placeholder?: string;
  /** 표시 포맷(기본: "February 18th, 2026" — Figma 라벨과 동일한 영문 서수 포맷) */
  formatDate?: (date: Date) => string;
  disabled?: boolean;
  /** 팝업 초기 열림(갤러리/데모용) */
  defaultOpen?: boolean;
  id?: string;
  name?: string;
  /** 트리거(Input 컨테이너) 클래스 */
  className?: string;
  /** 팝업 Calendar 클래스 */
  calendarClassName?: string;
}

/** "February 18th, 2026" — Figma 트리거 라벨 포맷 */
function defaultFormatDate(d: Date): string {
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const day = d.getDate();
  const mod10 = day % 10;
  const mod100 = day % 100;
  const suffix =
    mod100 >= 11 && mod100 <= 13
      ? "th"
      : mod10 === 1
        ? "st"
        : mod10 === 2
          ? "nd"
          : mod10 === 3
            ? "rd"
            : "th";
  return `${MONTHS[d.getMonth()]} ${day}${suffix}, ${d.getFullYear()}`;
}

const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/* ---------- 아이콘 (인라인 SVG, currentColor) ---------- */
function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
      <path d="M4 10h16M8.5 3.5v3.4M15.5 3.5v3.4" strokeLinecap="round" />
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.08 1.04l-4.25 4.25a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value,
      defaultValue = null,
      onValueChange,
      placeholder = "Pick a date",
      formatDate = defaultFormatDate,
      disabled = false,
      defaultOpen = false,
      inputSize,
      invalid,
      withPresets,
      presets,
      monthYearControl,
      isDateDisabled,
      today,
      id,
      name,
      className,
      calendarClassName,
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<Date | null>(defaultValue);
    const current = isControlled ? (value ?? null) : internal;

    const [open, setOpen] = React.useState(defaultOpen);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const dialogId = React.useId();

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // 바깥 클릭으로 닫기 (select.tsx 패턴)
    React.useEffect(() => {
      if (!open) return;
      const onPointerDown = (e: MouseEvent) => {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", onPointerDown);
      return () => document.removeEventListener("mousedown", onPointerDown);
    }, [open]);

    const choose = (d: Date) => {
      if (!isControlled) setInternal(d);
      onValueChange?.(d);
      setOpen(false);
      inputRef.current?.focus();
    };

    return (
      <div ref={rootRef} className="relative" data-node-id="7954:7493">
        <Input
          ref={inputRef}
          id={id}
          readOnly
          disabled={disabled}
          inputSize={inputSize}
          invalid={invalid}
          value={current ? formatDate(current) : ""}
          placeholder={placeholder}
          leftIcon={<CalendarIcon />}
          rightIcon={<ChevronDownIcon />}
          containerClassName={cn("cursor-pointer select-none", className)}
          className="cursor-pointer"
          role="combobox"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? dialogId : undefined}
          onClick={() => !disabled && setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
        />

        {name != null && (
          <input type="hidden" name={name} value={current ? toISO(current) : ""} />
        )}

        {open && (
          <div
            id={dialogId}
            role="dialog"
            aria-label="Choose date"
            className="absolute left-0 top-full z-50 mt-1"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.stopPropagation();
                setOpen(false);
                inputRef.current?.focus();
              }
            }}
          >
            <Calendar
              value={current}
              onValueChange={choose}
              defaultMonth={current ?? undefined}
              withPresets={withPresets}
              presets={presets}
              monthYearControl={monthYearControl}
              isDateDisabled={isDateDisabled}
              today={today}
              className={cn("shadow-overlay", calendarClassName)}
            />
          </div>
        )}
      </div>
    );
  }
);
DatePicker.displayName = "DatePicker";

export { DatePicker, defaultFormatDate };
