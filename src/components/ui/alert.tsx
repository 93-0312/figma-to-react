import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Alert — Figma "BO UI Kit" Alert(node 5655:4958). 중요 정보 콜아웃.
 *
 * Type: Default/Info/Success/Warning/Error → 테두리 색@32% + 배경 색@4% + 아이콘 색.
 * 제목=foreground medium, 설명=muted-foreground. 상태색은 통일 토큰(info/success/warning/destructive).
 */
const alertVariants = cva(
  "relative flex w-full flex-wrap items-center gap-3 overflow-hidden rounded-radius-xl border px-3.5 py-3 text-sm",
  {
    variants: {
      type: {
        default: "border-border bg-card [&_[data-alert-icon]]:text-foreground",
        info: "border-info/[0.32] bg-info/[0.04] [&_[data-alert-icon]]:text-info",
        success: "border-success/[0.32] bg-success/[0.04] [&_[data-alert-icon]]:text-success",
        warning: "border-warning/[0.32] bg-warning/[0.04] [&_[data-alert-icon]]:text-warning",
        error: "border-destructive/[0.32] bg-destructive/[0.04] [&_[data-alert-icon]]:text-destructive",
      },
    },
    defaultVariants: { type: "default" },
  }
);

export function StatusIcon({ type }: { type: NonNullable<VariantProps<typeof alertVariants>["type"]> }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": true, className: "size-full" } as const;
  return (
    <svg {...common} strokeLinecap="round" strokeLinejoin="round">
      {type === "success" && <><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>}
      {type === "warning" && <><path d="M12 3 2 20h20L12 3Z" /><path d="M12 9v5M12 17.5v.5" /></>}
      {type === "error" && <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6M15 9l-6 6" /></>}
      {(type === "info" || type === "default") && <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.5" /></>}
    </svg>
  );
}

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof alertVariants> {
  title?: React.ReactNode;
  /** 아이콘 직접 지정(미지정 시 type 기본 아이콘). false 면 숨김. */
  icon?: React.ReactNode | false;
  /** 우측 액션(버튼 등) */
  action?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, type = "default", title, icon, action, children, ...props }, ref) => (
    <div ref={ref} role="alert" data-node-id="5655:4958" className={cn(alertVariants({ type }), className)} {...props}>
      <div className="flex min-w-[240px] flex-1 items-start gap-2">
        {icon !== false && (
          <span data-alert-icon className="inline-flex size-5 shrink-0 [&_svg]:size-5">
            {icon ?? <StatusIcon type={type ?? "default"} />}
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1 leading-5">
          {title != null && <p className="font-medium text-foreground">{title}</p>}
          {children != null && <p className="text-muted-foreground">{children}</p>}
        </div>
      </div>
      {action && <div className="flex shrink-0 items-start gap-2">{action}</div>}
    </div>
  )
);
Alert.displayName = "Alert";

export { Alert, alertVariants };
