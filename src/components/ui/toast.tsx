import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { StatusIcon } from "./alert";
import { Spinner } from "./spinner";

/**
 * Toast — Figma "BO UI Kit" Toast(node 7728:238). 떠 있는 알림 카드.
 *
 * Alert 과 구조는 같으나 popover 배경 + border + shadow-overlay(플로팅). Type: Default/Loading/Info/
 * Success/Warning/Error. Loading=Spinner 아이콘, 상태=색 아이콘. 제목=foreground, 설명=muted.
 * (배치/타이머 등 알림 큐 로직은 앱이 담당 — 이 컴포넌트는 표현 단위.)
 */
const toastIconColor = cva("inline-flex size-5 shrink-0 [&_svg]:size-5", {
  variants: {
    type: {
      default: "text-foreground",
      loading: "text-muted-foreground",
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      error: "text-destructive",
    },
  },
  defaultVariants: { type: "default" },
});

export interface ToastProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof toastIconColor> {
  title?: React.ReactNode;
  icon?: React.ReactNode | false;
  action?: React.ReactNode;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, type = "default", title, icon, action, children, ...props }, ref) => {
    const statusType =
      type === "info" || type === "success" || type === "warning" || type === "error"
        ? type
        : "default";
    const resolvedIcon =
      icon ?? (type === "loading" ? <Spinner size="sm" /> : <StatusIcon type={statusType} />);
    return (
      <div
        ref={ref}
        role="status"
        data-node-id="7728:238"
        className={cn(
          "flex w-full flex-wrap items-center gap-3 rounded-radius-xl border border-border bg-popover px-3.5 py-3 text-sm shadow-overlay",
          className
        )}
        {...props}
      >
        <div className="flex min-w-[240px] flex-1 items-start gap-2">
          {icon !== false && <span className={toastIconColor({ type })}>{resolvedIcon}</span>}
          <div className="flex min-w-0 flex-1 flex-col gap-1 leading-5">
            {title != null && <p className="font-medium text-foreground">{title}</p>}
            {children != null && <p className="text-muted-foreground">{children}</p>}
          </div>
        </div>
        {action && <div className="flex shrink-0 items-start gap-2">{action}</div>}
      </div>
    );
  }
);
Toast.displayName = "Toast";

export { Toast };
