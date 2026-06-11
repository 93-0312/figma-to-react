import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Label — Figma "BO UI Kit" Label 컴포넌트(node 7658:2157).
 *
 * 폼 컨트롤에 연결되는 접근성 라벨. text-xs(12px, Pretendard Medium, tracking 0.12) + foreground.
 * `htmlFor` 로 컨트롤과 연결한다.
 *
 * @see https://coss.com/ui/docs/components/label
 */
export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "inline-flex items-center text-xs font-medium text-foreground",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      data-node-id="7658:2157"
      {...props}
    />
  )
);
Label.displayName = "Label";

export { Label };
