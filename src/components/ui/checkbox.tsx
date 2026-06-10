import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Checkbox — Figma "BO UI Kit" `.Selector` 컴포넌트(node 5667:129)를 옮긴 React 컴포넌트.
 *
 * 라벨/설명 없는 **체크박스 박스 자체**만 담는다(Title·Description·CardStyle 은
 * Figma 의 사용 예시였던 `CheckBox` 컴포넌트 쪽 구성이라 제외).
 *
 * 상태 (Figma `.Selector` 진리표 — `checked`(IsSelected)가 마스터 게이트):
 *  | checked | indeterminate | 렌더                                  |
 *  |   true  |     false     | bg primary + 흰 체크                  |
 *  |   true  |     true      | 흰 배경 + 테두리 + primary minus 바   |
 *  |  false  |   (무관)      | 흰 배경 + 테두리 (빈 박스)            |
 *  → indeterminate 는 `checked`가 true 일 때만 마크를 minus 로 바꾼다(독립 X).
 *  - disabled : opacity 64% / mobile : 16px → 18px
 *
 * 네이티브 <input type="checkbox">를 시각적으로 숨겨 키보드/포커스 접근성을 확보하며,
 * 제어(controlled, `checked`)·비제어(uncontrolled, `defaultChecked`) 모두 지원한다.
 *
 * @see https://coss.com/ui/docs/components/checkbox
 */

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "checked" | "defaultChecked" | "onChange" | "size"
  > {
  /** 제어 모드 체크 상태 */
  checked?: boolean;
  /** 비제어 모드 초기 체크 상태 */
  defaultChecked?: boolean;
  /** 부모(부분 선택) 상태 — minus 바 표시 */
  indeterminate?: boolean;
  /** 모바일 사이즈(18px). 기본은 데스크톱 16px */
  mobile?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      defaultChecked,
      indeterminate = false,
      disabled = false,
      mobile = false,
      onCheckedChange,
      className,
      ...inputProps
    },
    ref
  ) => {
    const isControlled = checked !== undefined;
    const [internal, setInternal] = React.useState(defaultChecked ?? false);
    const isChecked = isControlled ? checked : internal;

    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // checked(selected)가 마스터 게이트: 선택된 상태에서만 마크를 표시한다
    const showCheck = isChecked && !indeterminate;
    const showMinus = isChecked && indeterminate;

    React.useEffect(() => {
      // 네이티브 indeterminate 도 "선택 + 부모"일 때만 true
      if (inputRef.current) inputRef.current.indeterminate = showMinus;
    }, [showMinus]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.checked;
      if (!isControlled) setInternal(next);
      onCheckedChange?.(next);
    };

    return (
      <label
        className={cn(
          "inline-flex shrink-0 items-center justify-center",
          disabled ? "cursor-not-allowed opacity-[0.64]" : "cursor-pointer",
          className
        )}
      >
        <input
          ref={inputRef}
          type="checkbox"
          className="peer sr-only"
          checked={isControlled ? checked : undefined}
          defaultChecked={isControlled ? undefined : defaultChecked}
          disabled={disabled}
          onChange={handleChange}
          {...inputProps}
        />
        {/* 셀렉터 박스 */}
        <span
          aria-hidden
          className={cn(
            "relative flex items-center justify-center rounded-radius-sm border transition-colors",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-background",
            mobile ? "size-[18px]" : "size-4",
            showCheck
              ? "border-transparent bg-primary text-primary-foreground"
              : "border-input bg-card shadow-xs"
          )}
        >
          {showCheck && (
            <svg
              viewBox="0 0 8 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              className={mobile ? "size-2.5" : "size-2"}
              aria-hidden
            >
              <path
                d="M1 4.2 3 6l4-4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {showMinus && (
            <span className="h-0.5 w-1.5 rounded-full bg-primary" />
          )}
        </span>
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
