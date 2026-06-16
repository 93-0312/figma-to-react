import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Input — Figma "BO UI Kit" Input 컴포넌트(node 7745:699)를 옮긴 슬롯형 입력.
 *
 * 구조: 테두리 컨테이너 + [leftIcon][prefix][native input][suffix][rightIcon].
 * 상태(Figma Type 변형):
 *  - Default : border input-border
 *  - Error   : border destructive(#ef4444 빨강)   → `invalid` prop
 *  - Disabled: 컨테이너 opacity 64%               → input `disabled`
 *  - Focus   : 테두리가 disabled(#45556c@30%)로 진해지고 3px 회색 글로우 링
 *              (Figma Focus 노드 7745:700 Stroke: 3px disabled@30% × opacity23% ≈ @7%, offset 없음).
 *              ErrorFocused(8060:3643)는 테두리 destructive + 3px destructive@15% 링.
 *              ※ Figma 의 회색 링이며 shadcn 기본 파란 ring 이 아님.
 * 사이즈(Figma Size): Small h28 / Default h32 / Large h36.
 *
 * ※ 미구현(특수 변형 — 필요 시 추가): 인라인 Button, Badge, Kbd 단축키, MultiSelect,
 *    File, InnerLabel(플로팅 라벨), Fill=True(채움 배경), darkBackground.
 *
 * @see https://coss.com/ui/docs/components/input
 */
const inputVariants = cva(
  "flex w-full items-center gap-1 rounded-radius border bg-card text-sm text-foreground shadow-xs transition-colors " +
    "focus-within:ring-[3px] focus-within:ring-offset-0 " +
    "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-[0.64]",
  {
    variants: {
      inputSize: {
        sm: "h-7 px-1.5",
        md: "h-8 px-2",
        lg: "h-9 px-2",
      },
      invalid: {
        true: "border-destructive focus-within:ring-destructive/[0.15]",
        false: "border-input focus-within:border-disabled/30 focus-within:ring-disabled/[0.07]",
      },
    },
    defaultVariants: { inputSize: "md", invalid: false },
  }
);

type SlotProps = {
  /** 좌측 아이콘 */
  leftIcon?: React.ReactNode;
  /** 우측 아이콘 */
  rightIcon?: React.ReactNode;
  /** 앞 텍스트 (예: https://) */
  prefix?: React.ReactNode;
  /** 뒤 텍스트 (예: .com) */
  suffix?: React.ReactNode;
  /** 에러 상태 (빨간 테두리) */
  invalid?: boolean;
};

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix">,
    Pick<VariantProps<typeof inputVariants>, "inputSize">,
    SlotProps {
  /** 컨테이너 클래스(테두리/배경 등) */
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      inputSize,
      invalid = false,
      leftIcon,
      rightIcon,
      prefix,
      suffix,
      type = "text",
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(inputVariants({ inputSize, invalid }), containerClassName)}
        data-node-id="7745:699"
      >
        {leftIcon ? (
          <span className="inline-flex shrink-0 opacity-80 [&_svg]:size-4">
            {leftIcon}
          </span>
        ) : null}
        {prefix != null ? (
          <span className="shrink-0 text-muted-foreground">{prefix}</span>
        ) : null}
        <input
          ref={ref}
          type={type}
          className={cn(
            "min-w-0 flex-1 bg-transparent px-1 text-foreground outline-none placeholder:text-muted-foreground",
            className
          )}
          {...props}
        />
        {suffix != null ? (
          <span className="shrink-0 text-muted-foreground">{suffix}</span>
        ) : null}
        {rightIcon ? (
          <span className="inline-flex shrink-0 opacity-80 [&_svg]:size-4">
            {rightIcon}
          </span>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
