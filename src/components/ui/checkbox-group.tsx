import * as React from "react";
import { cn } from "../../lib/utils";
import { Checkbox } from "./checkbox";

/**
 * CheckboxGroup / CheckboxGroupItem — Figma "BO UI Kit" Checkbox Group(node 5675:291).
 *
 * 다중 선택 그룹. 기존 `Checkbox`(셀렉터 박스)를 재사용해 항목(체크박스 + 제목 +
 * 선택적 설명)을 구성한다. 접근성: 컨테이너는 `role="group"`(필요 시 `aria-label`
 * 전달), 제목은 `<label htmlFor>` 로 숨긴 네이티브 체크박스와 연결된다.
 *
 * Figma 구조 → 코드 매핑:
 *  - 그룹 세로 간격 12px            → `gap-3`
 *  - 하위 단계 들여쓰기: Figma 는 단계별 래퍼 프레임(SecondarySubItems px16,
 *    LastSubItems px32)로 표현     → 항목의 `depth` prop (양쪽 padding = depth×16px)
 *  - 항목: .Selector + Title(16/24, foreground) [+ Description(12/16, #8d95a2
 *    = tertiary-foreground), 제목/설명 gap 6px]
 *  - CheckBox 항목 variant → prop 1:1 매핑:
 *    | Figma 속성        | prop           |
 *    | Selected          | (value 포함 여부) 또는 `checked` 오버라이드 |
 *    | Disabled          | `disabled`     |
 *    | Mobile            | `mobile`       |
 *    | WithDescription   | `description` 존재 여부 |
 *    | Title/Description | `title` / `description` |
 *  - 체크 상태 진리표(checked 가 마스터 게이트)는 `Checkbox` JSDoc 참조 —
 *    부모(부분 선택) minus 는 `checked && indeterminate` 일 때만 표시된다.
 */
interface CheckboxGroupContextValue {
  value: string[];
  toggle: (itemValue: string, next: boolean) => void;
  disabled?: boolean;
  mobile?: boolean;
}
const CheckboxGroupContext = React.createContext<CheckboxGroupContextValue | null>(null);

export interface CheckboxGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** 제어 모드 선택값 목록 */
  value?: string[];
  /** 비제어 모드 초기 선택값 목록 */
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** 그룹 전체 비활성화 */
  disabled?: boolean;
  /** 그룹 전체 모바일 사이즈(18px 셀렉터) */
  mobile?: boolean;
}

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    { className, value, defaultValue, onValueChange, disabled, mobile, children, ...props },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<string[]>(defaultValue ?? []);
    const current = isControlled ? value : internal;

    const toggle = React.useCallback(
      (itemValue: string, next: boolean) => {
        const nextArr = next
          ? Array.from(new Set([...current, itemValue]))
          : current.filter((v) => v !== itemValue);
        if (!isControlled) setInternal(nextArr);
        onValueChange?.(nextArr);
      },
      [current, isControlled, onValueChange]
    );

    return (
      <CheckboxGroupContext.Provider value={{ value: current, toggle, disabled, mobile }}>
        <div
          ref={ref}
          role="group"
          data-node-id="5675:291"
          className={cn("flex w-full flex-col gap-3", className)}
          {...props}
        >
          {children}
        </div>
      </CheckboxGroupContext.Provider>
    );
  }
);
CheckboxGroup.displayName = "CheckboxGroup";

export interface CheckboxGroupItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 그룹 선택값에서 이 항목을 식별하는 값 */
  value: string;
  /** 제목 (16/24 foreground) */
  title?: React.ReactNode;
  /** 설명 (12/16 tertiary-foreground) — 있으면 Figma WithDescription=True 구성 */
  description?: React.ReactNode;
  /** 들여쓰기 단계 (Figma SecondarySubItems=1, LastSubItems=2 — 양쪽 16px/단계) */
  depth?: number;
  /** 체크 상태 오버라이드(부모 tri-state 용). 생략 시 그룹 value 포함 여부 */
  checked?: boolean;
  /** 부모(부분 선택) minus 표시 — checked 일 때만 유효 (Checkbox 진리표 참조) */
  indeterminate?: boolean;
  disabled?: boolean;
  /** 모바일 사이즈(18px) — 그룹 mobile 과 OR */
  mobile?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const CheckboxGroupItem = React.forwardRef<HTMLDivElement, CheckboxGroupItemProps>(
  (
    {
      className,
      style,
      value,
      title,
      description,
      depth = 0,
      checked,
      indeterminate = false,
      disabled,
      mobile,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const ctx = React.useContext(CheckboxGroupContext);
    if (!ctx) throw new Error("CheckboxGroupItem must be used within CheckboxGroup");
    const id = React.useId();
    const isDisabled = disabled || ctx.disabled;
    const isChecked = checked ?? ctx.value.includes(value);

    return (
      <div
        ref={ref}
        className={cn("flex w-full items-start gap-2", className)}
        style={depth > 0 ? { paddingLeft: depth * 16, paddingRight: depth * 16, ...style } : style}
        {...props}
      >
        <Checkbox
          id={id}
          className="mt-1"
          checked={isChecked}
          indeterminate={indeterminate}
          disabled={isDisabled}
          mobile={mobile || ctx.mobile}
          onCheckedChange={(next) => {
            ctx.toggle(value, next);
            onCheckedChange?.(next);
          }}
        />
        {(title != null || description != null) && (
          <span
            className={cn(
              "flex min-w-0 flex-1 flex-col gap-1.5",
              isDisabled && "cursor-not-allowed opacity-[0.64]"
            )}
          >
            {title != null && (
              <label
                htmlFor={id}
                className={cn(
                  "text-base leading-6 text-foreground",
                  isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                )}
              >
                {title}
              </label>
            )}
            {description != null && (
              <span className="text-xs leading-4 text-tertiary-foreground">{description}</span>
            )}
          </span>
        )}
      </div>
    );
  }
);
CheckboxGroupItem.displayName = "CheckboxGroupItem";

export { CheckboxGroup, CheckboxGroupItem };
