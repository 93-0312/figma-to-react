import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Textarea — Figma "BO UI Kit" Textarea(node 7751:1067). 여러 줄 입력.
 *
 * Input 과 동일한 토큰/포커스 관례(회색 3px 링, border-input→focus 시 disabled/30)를 재사용한다.
 * bg=background(#f8fafc), rounded-radius, shadow-xs. size sm/md/lg(최소높이). invalid→destructive.
 * Figma 의 코너 리사이즈 그립은 네이티브 `resize-y` 로 대체.
 */
const textareaVariants = cva(
  "flex w-full resize-y rounded-radius border bg-background text-sm text-foreground shadow-xs outline-none transition-colors " +
    "placeholder:text-muted-foreground " +
    "focus-visible:ring-[3px] focus-visible:ring-offset-0 " +
    "disabled:cursor-not-allowed disabled:opacity-[0.64]",
  {
    variants: {
      inputSize: {
        sm: "min-h-16 px-2 py-1",
        md: "min-h-[76px] px-3 py-1.5",
        lg: "min-h-24 px-3 py-2",
      },
      invalid: {
        true: "border-destructive focus-visible:ring-destructive/[0.15]",
        false:
          "border-input focus-visible:border-disabled/30 focus-visible:ring-disabled/[0.07]",
      },
    },
    defaultVariants: { inputSize: "md", invalid: false },
  }
);

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, inputSize, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      data-node-id="7751:1067"
      className={cn(textareaVariants({ inputSize, invalid }), className)}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
