import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * RadioGroup / RadioGroupItem — Figma "BO UI Kit" Radio Group(node 7669:1454).
 *
 * 단일 선택(라디오). 항목 = 라디오 원 + 제목(text-base) + 설명(text-xs muted).
 * 라디오 원: 미선택=bg-background+border-input+shadow / 선택=bg-foreground + 흰 점(6px).
 * `cardStyle` 시 항목을 테두리 카드로 감쌈. 숨긴 네이티브 `<input type=radio>` 로 접근성 확보.
 */
interface RadioGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  name: string;
  disabled?: boolean;
}
const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

let radioGroupId = 0;

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, defaultValue, onValueChange, name, disabled, children, ...props }, ref) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState(defaultValue);
    const current = isControlled ? value : internal;
    const autoName = React.useMemo(() => name ?? `radio-group-${++radioGroupId}`, [name]);
    return (
      <RadioGroupContext.Provider
        value={{
          value: current,
          name: autoName,
          disabled,
          onValueChange: (v) => {
            if (!isControlled) setInternal(v);
            onValueChange?.(v);
          },
        }}
      >
        <div
          ref={ref}
          role="radiogroup"
          data-node-id="7669:1454"
          className={cn("flex flex-col gap-3", className)}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export interface RadioGroupItemProps
  extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "title"> {
  value: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  /** 테두리 카드로 감쌈 */
  cardStyle?: boolean;
}

const RadioGroupItem = React.forwardRef<HTMLLabelElement, RadioGroupItemProps>(
  ({ className, value, title, description, disabled, cardStyle, children, ...props }, ref) => {
    const ctx = React.useContext(RadioGroupContext);
    if (!ctx) throw new Error("RadioGroupItem must be used within RadioGroup");
    const isDisabled = disabled || ctx.disabled;
    const checked = ctx.value === value;
    return (
      <label
        ref={ref}
        className={cn(
          "flex items-start gap-2",
          cardStyle && "rounded-radius border border-border p-3",
          isDisabled ? "cursor-not-allowed opacity-[0.64]" : "cursor-pointer",
          className
        )}
        {...props}
      >
        <input
          type="radio"
          name={ctx.name}
          value={value}
          checked={checked}
          disabled={isDisabled}
          onChange={() => ctx.onValueChange?.(value)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={cn(
            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-radius-full border shadow-xs transition-colors",
            "peer-focus-visible:ring-[3px] peer-focus-visible:ring-offset-0 peer-focus-visible:ring-disabled/[0.07]",
            checked ? "border-foreground bg-foreground" : "border-input bg-background"
          )}
        >
          {checked && <span className="size-1.5 rounded-radius-full bg-card" />}
        </span>
        {(title != null || description != null || children != null) && (
          <span className="flex min-w-0 flex-1 flex-col gap-1.5">
            {title != null && <span className="text-base leading-6 text-foreground">{title}</span>}
            {children}
            {description != null && (
              <span className="text-xs leading-[14px] tracking-[0.12px] text-muted-foreground">{description}</span>
            )}
          </span>
        )}
      </label>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
