import * as React from "react";
import { cn } from "../../lib/utils";
import { toggleVariants, type ToggleProps } from "./toggle";

/**
 * ToggleGroup / ToggleGroupItem — Figma "BO UI Kit" Toggle Group(node 5686:270).
 *
 * 여러 Toggle 에 공유 상태를 제공하는 컨테이너(세그먼티드 컨트롤 형태).
 * Figma 변형: `Outline`(T/F) → `variant`, `Orientation`(Horizontal/Vertical) → `orientation`,
 * `Size`(Small/Default/Large) → `size`. 아이템들은 테두리/모서리를 공유하도록 이어 붙인다
 * (그룹이 rounded-radius-lg + overflow-hidden, 인접 테두리는 음수 마진으로 겹침 제거).
 *
 * 선택 동작: `type="single"`(string, 라디오식 — 같은 값 재클릭 해제) 또는
 * `type="multiple"`(string[]). 활성 아이템은 Toggle 의 on 상태(muted/64)로 표시.
 *
 * @see https://coss.com/ui/docs/components/toggle-group
 */
type Orientation = "horizontal" | "vertical";

interface ToggleGroupContextValue {
  value: string[];
  toggle: (itemValue: string) => void;
  variant: ToggleProps["variant"];
  size: ToggleProps["size"];
  orientation: Orientation;
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(
  null
);

type ToggleGroupBaseProps = {
  variant?: ToggleProps["variant"];
  size?: ToggleProps["size"];
  orientation?: Orientation;
  className?: string;
  children?: React.ReactNode;
};

export type ToggleGroupProps = ToggleGroupBaseProps &
  (
    | {
        type: "single";
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
      }
    | {
        type: "multiple";
        value?: string[];
        defaultValue?: string[];
        onValueChange?: (value: string[]) => void;
      }
  );

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (props, ref) => {
    const {
      type,
      variant = "outline",
      size = "md",
      orientation = "horizontal",
      className,
      children,
    } = props;

    const isControlled = props.value !== undefined;
    const [internal, setInternal] = React.useState<string[]>(() => {
      if (props.defaultValue == null) return [];
      return Array.isArray(props.defaultValue)
        ? props.defaultValue
        : [props.defaultValue];
    });

    const value = isControlled
      ? Array.isArray(props.value)
        ? props.value
        : props.value
          ? [props.value]
          : []
      : internal;

    const toggle = (itemValue: string) => {
      let next: string[];
      if (type === "single") {
        next = value[0] === itemValue ? [] : [itemValue];
        if (!isControlled) setInternal(next);
        (props.onValueChange as ((v: string) => void) | undefined)?.(
          next[0] ?? ""
        );
      } else {
        next = value.includes(itemValue)
          ? value.filter((v) => v !== itemValue)
          : [...value, itemValue];
        if (!isControlled) setInternal(next);
        (props.onValueChange as ((v: string[]) => void) | undefined)?.(next);
      }
    };

    return (
      <ToggleGroupContext.Provider
        value={{ value, toggle, variant, size, orientation }}
      >
        <div
          ref={ref}
          role="group"
          data-node-id="5686:270"
          className={cn(
            "inline-flex w-fit overflow-hidden rounded-radius-lg",
            orientation === "vertical"
              ? "flex-col [&>*:not(:first-child)]:-mt-px"
              : "flex-row [&>*:not(:first-child)]:-ml-px",
            className
          )}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  }
);
ToggleGroup.displayName = "ToggleGroup";

export interface ToggleGroupItemProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "type" | "value"
  > {
  /** 이 아이템의 값 — 그룹 선택 상태와 비교된다. */
  value: string;
  iconOnly?: ToggleProps["iconOnly"];
}

const ToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  ToggleGroupItemProps
>(({ value, iconOnly, className, onClick, ...props }, ref) => {
  const ctx = React.useContext(ToggleGroupContext);
  if (!ctx) throw new Error("ToggleGroupItem must be used within ToggleGroup");
  const isOn = ctx.value.includes(value);

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={isOn}
      data-state={isOn ? "on" : "off"}
      className={cn(
        toggleVariants({ variant: ctx.variant, size: ctx.size, iconOnly }),
        // twMerge 가 커스텀 radius 키(rounded-radius-lg)를 충돌로 인식 못 하므로 !important 로 강제.
        // 그룹이 rounded+overflow-hidden 이라 바깥 모서리는 그룹이 둥글게 클립한다.
        "!rounded-none focus-visible:z-10",
        className
      )}
      onClick={(e) => {
        ctx.toggle(value);
        onClick?.(e);
      }}
      {...props}
    />
  );
});
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
