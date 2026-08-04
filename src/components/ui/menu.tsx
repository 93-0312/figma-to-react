import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { switchVariants } from "./switch";

/**
 * Menu — Figma "BO UI Kit" Menu(node 7767:2802) + .MenuItem(7767:2641) +
 * .MenuGroupTitle(7767:2865)를 옮긴 팝업 메뉴 패널.
 *
 * 구성:
 *  - 패널(Menu): popover 배경, border, rounded-radius-xl, shadow-xs(Figma: 0 1px 2px 5% —
 *    Select 패널의 shadow-overlay 와 달리 Menu 는 xs 그림자), p-1, 항목 gap-px.
 *  - 항목(MenuItem): h-28, rounded-radius-lg, text-xs medium.
 *  - 그룹 타이틀/구분선(MenuGroupTitle / MenuSeparator), 단축키(MenuShortcut).
 *
 * ★ .MenuItem variant 진리표 (Figma 12개 조합 — Selected 와 ShowLeftIcon 은 세트에서
 *   항상 반대값으로만 발행됨: Selected=False⇔ShowLeftIcon=True):
 *
 * | Type        | Selected | HighLight | 렌더 결과                                          |
 * |-------------|----------|-----------|----------------------------------------------------|
 * | Default     | False    | False     | 좌아이콘(16, 80%) + 텍스트 #2f3034(→foreground 근사) |
 * | Default     | True     | False     | 좌측 16px 빈 스페이서(체크 표시 없음!) + 동일 텍스트   |
 * | Default     | *        | True      | bg #eff6ff(→primary/8% 근사) + 텍스트/아이콘 accent-foreground |
 * | Destructive | *        | False     | 텍스트/좌아이콘 destructive-foreground               |
 * | Destructive | *        | True      | ★배경 없음(Figma 조건 그대로) — 텍스트 색 유지        |
 * | Disabled    | *        | *         | 전체 opacity 50% (Disabled+HighLight 조합은 Figma 상
 *   bg #eff6ff + 파란 텍스트지만, 코드에선 disabled 가 포인터를 차단해 도달 불가 — 문서화)  |
 *
 * 접근성: 패널 role=menu + ↑/↓/Home/End roving focus, 항목 role=menuitem
 * (showSwitch 시 menuitemcheckbox + aria-checked). Switch 는 중첩 버튼을 피하려고
 * switchVariants 를 쓴 시각 전용 스팬으로 렌더(토글은 항목 클릭).
 *
 * @see https://coss.com/ui/docs/components/menu
 */
const menuItemVariants = cva(
  "flex h-7 w-full select-none items-center rounded-radius-lg px-1 text-left text-xs font-medium outline-none transition-colors",
  {
    variants: {
      /** Figma `Type` variant 1:1 매핑 */
      type: {
        default:
          "text-foreground hover:bg-primary/[0.08] hover:text-accent-foreground focus-visible:bg-primary/[0.08] focus-visible:text-accent-foreground",
        // Figma: Destructive 는 HighLight=True 에도 배경 fill 이 없다(조건 그대로 따름).
        destructive: "text-destructive-foreground",
        disabled: "text-foreground opacity-50",
      },
    },
    defaultVariants: { type: "default" },
  }
);

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="size-4"
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {}

/** 메뉴 패널(Figma Menu 7767:2802). role=menu + 화살표 roving focus. */
const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  ({ className, children, onKeyDown, ...props }, ref) => {
    const innerRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    const moveFocus = (dir: 1 | -1 | "first" | "last") => {
      const items = Array.from(
        innerRef.current?.querySelectorAll<HTMLButtonElement>(
          "[data-menu-item]:not([disabled])"
        ) ?? []
      );
      if (!items.length) return;
      if (dir === "first") return items[0].focus();
      if (dir === "last") return items[items.length - 1].focus();
      const idx = items.findIndex((el) => el === document.activeElement);
      items[(idx + dir + items.length) % items.length]?.focus();
    };

    return (
      <div
        ref={innerRef}
        role="menu"
        aria-orientation="vertical"
        data-node-id="7767:2802"
        className={cn(
          "flex flex-col gap-px rounded-radius-xl border border-border bg-popover p-1 shadow-xs",
          className
        )}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            moveFocus(1);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            moveFocus(-1);
          } else if (e.key === "Home") {
            e.preventDefault();
            moveFocus("first");
          } else if (e.key === "End") {
            e.preventDefault();
            moveFocus("last");
          }
          onKeyDown?.(e);
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Menu.displayName = "Menu";

export interface MenuItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">,
    VariantProps<typeof menuItemVariants> {
  /** 좌측 아이콘(Figma LeftIcon/ShowLeftIcon). 16px, opacity 80%. */
  icon?: React.ReactNode;
  /**
   * Figma `Selected` variant — 좌측에 아이콘 대신 16px 빈 스페이서를 렌더한다
   * (Figma 는 체크 표시 없이 아이콘 자리만 비운다).
   */
  selected?: boolean;
  /** Figma `ShowRightIcon` — true 면 rightIcon(기본 chevron-right)을 표시. */
  showRightIcon?: boolean;
  /** Figma `RightIcon` 인스턴스 스왑. 미지정 시 chevron-right. */
  rightIcon?: React.ReactNode;
  /** Figma `ShowKeyboardShortcut` + Kbd — 우측 단축키 텍스트. */
  shortcut?: string;
  /** Figma `ShowSwitch` — 우측에 스위치 표시(role=menuitemcheckbox). */
  showSwitch?: boolean;
  /** 스위치 상태(showSwitch 일 때). */
  switchChecked?: boolean;
  /** 스위치 토글 콜백 — 항목 클릭으로 토글된다. */
  onSwitchChange?: (checked: boolean) => void;
}

/** 메뉴 항목(Figma .MenuItem 7767:2641). */
const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  (
    {
      className,
      type,
      icon,
      selected = false,
      showRightIcon = false,
      rightIcon,
      shortcut,
      showSwitch = false,
      switchChecked = false,
      onSwitchChange,
      onClick,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || type === "disabled";
    return (
      <button
        ref={ref}
        type="button"
        role={showSwitch ? "menuitemcheckbox" : "menuitem"}
        aria-checked={showSwitch ? switchChecked : undefined}
        disabled={isDisabled}
        data-menu-item=""
        data-node-id="7767:2641"
        className={cn(
          menuItemVariants({ type: isDisabled ? "disabled" : type }),
          isDisabled && "pointer-events-none",
          className
        )}
        onClick={(e) => {
          if (showSwitch) onSwitchChange?.(!switchChecked);
          onClick?.(e);
        }}
        {...props}
      >
        {selected ? (
          // Figma Selected=True: 아이콘 자리를 16px 로 비워둔다(체크 없음).
          <span className="size-4 shrink-0" aria-hidden />
        ) : icon ? (
          <span className="inline-flex size-4 shrink-0 items-center justify-center opacity-80 [&_svg]:size-4">
            {icon}
          </span>
        ) : null}
        <span className="min-w-0 flex-1 truncate px-1">{children}</span>
        {showSwitch ? (
          // 중첩 <button> 을 피하기 위한 시각 전용 스위치(md=18×30, Figma Switch 인스턴스와 동일).
          <span
            data-state={switchChecked ? "on" : "off"}
            aria-hidden
            className={cn(switchVariants({ size: "md" }), "pointer-events-none")}
          >
            <span
              data-state={switchChecked ? "on" : "off"}
              className="block size-[14px] rounded-radius-full bg-card shadow-xs transition-transform data-[state=on]:translate-x-3"
            />
          </span>
        ) : null}
        {shortcut ? <MenuShortcut>{shortcut}</MenuShortcut> : null}
        {showRightIcon ? (
          <span className="inline-flex size-4 shrink-0 items-center justify-center opacity-80 [&_svg]:size-4">
            {rightIcon ?? <ChevronRightIcon />}
          </span>
        ) : null}
      </button>
    );
  }
);
MenuItem.displayName = "MenuItem";

/** 단축키 표기(Figma Kbd 7781:8195 — Background=False, #686f7a→muted-foreground 근사). */
const MenuShortcut = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "shrink-0 rounded-radius-sm px-1 py-px text-xs font-medium text-muted-foreground opacity-80",
      className
    )}
    {...props}
  />
));
MenuShortcut.displayName = "MenuShortcut";

export interface MenuGroupTitleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** 타이틀 위 구분선 표시(Figma .MenuGroupTitle 의 Separator 인스턴스 토글). */
  separator?: boolean;
}

/**
 * 그룹 타이틀(Figma .MenuGroupTitle 7767:2865). 텍스트 h-28 + 선택적 상단 구분선.
 * 텍스트 없이 separator 만 쓰려면 MenuSeparator 를 사용.
 */
const MenuGroupTitle = React.forwardRef<HTMLDivElement, MenuGroupTitleProps>(
  ({ className, separator = false, children, ...props }, ref) => (
    <div
      ref={ref}
      role="presentation"
      data-node-id="7767:2865"
      className={cn("flex flex-col gap-0.5 px-2", className)}
      {...props}
    >
      {separator ? (
        <div className="py-1" role="separator" aria-orientation="horizontal">
          <div className="border-t border-border" />
        </div>
      ) : null}
      {children != null ? (
        <div className="flex h-7 items-center text-xs font-medium text-muted-foreground">
          <span className="min-w-0 flex-1 truncate">{children}</span>
        </div>
      ) : null}
    </div>
  )
);
MenuGroupTitle.displayName = "MenuGroupTitle";

/** 구분선 단독(Figma .MenuGroupTitle 의 TextFrame 숨김 상태 — 높이 9px). */
const MenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    aria-orientation="horizontal"
    className={cn("px-2 py-1", className)}
    {...props}
  >
    <div className="border-t border-border" />
  </div>
));
MenuSeparator.displayName = "MenuSeparator";

export {
  Menu,
  MenuItem,
  MenuGroupTitle,
  MenuSeparator,
  MenuShortcut,
  menuItemVariants,
};
