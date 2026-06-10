import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Input — Figma "BO UI Kit" Input 컴포넌트(node 7745:699)를 옮긴 네이티브 입력.
 *
 * 박스: bg card / 1px input-border / radius 10 / shadow-xs / h-32 / 텍스트 inset 12px
 * (Figma Input p-2(8) + 내부 LabelFrame px-1(4) = 12px → px-3).
 * placeholder 는 muted-foreground.
 *
 * @see https://coss.com/ui/docs/components/input
 */
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-8 w-full rounded-radius border border-input bg-card px-3 text-sm text-foreground shadow-xs transition-colors",
          "placeholder:text-muted-foreground",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        data-node-id="7745:699"
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
