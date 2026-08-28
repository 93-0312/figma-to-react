import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Input — Figma "BO UI Kit" Input 컴포넌트(node 7745:699)를 옮긴 슬롯형 입력.
 *
 * 구조: 테두리 컨테이너 + [leftIcon][prefix][native input][suffix][rightIcon].
 * 상태(Figma Type 변형):
 *  - Default : border input-border
 *  - Error   : border destructive(#fb2c36 빨강)   → `invalid` prop
 *  - Disabled: 컨테이너 opacity 64%               → input `disabled`
 *  - Focus   : 테두리가 primary/ring 색(#2b7fff)으로 바뀌고 3px 파란 글로우 링
 *              (Figma Focus 노드 7745:700 — 본 테두리 stroke 와 별도 "Stroke" 오버레이 프레임이
 *              모두 VariableID:5632:2338(ring/primary) 참조, 오버레이는 3px OUTSIDE stroke ×
 *              노드 opacity 15%). ErrorFocused(8060:3643)는 테두리 destructive + 3px destructive@15% 링
 *              — 동일한 3px/15% 패턴에 색만 다르다.
 *              (2026-07 Figma 갱신: 이전엔 disabled 회색 링이었으나 primary/ring 파랑으로 재바인딩됨.)
 * 사이즈(Figma Size): Small h28 / Default h32 / Large h36.
 *
 * Figma `Fill` variant 은 **배경 채움이 아니다** — Label 텍스트 색만 다르다(2026-08 재확인):
 *    Fill=False → #8d95a2(tertiary-foreground, placeholder) / Fill=True → #212226(foreground, 값 입력됨).
 *    즉 브라우저의 placeholder↔value 전환이 그대로 대응하므로 **별도 prop 이 필요 없다**
 *    (`placeholder:text-tertiary-foreground` + `text-foreground`).
 *
 * ※ 다른 Type 변형의 처리 위치:
 *    - 인라인 Button/Badge/Kbd, InnerLabel → `InputGroup` (input-group.tsx)
 *    - File → `FileInput` (file-input.tsx)
 *    - MultiSelect → **Figma 미완성**. 6개 variant 전부 Default 와 구조·렌더가 동일하고
 *      태그/칩 디자인이 없다. 디자인이 확정되면 그때 추출한다.
 *    - darkBackground → **컴포넌트 상태가 아니다.** 48개 variant 전부에서 `visible:false` 인
 *      디자인 파일 내부 헬퍼(배경 대비 확인용 스와치)라 구현 대상이 아니다.
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
        false: "border-input focus-within:border-ring focus-within:ring-ring/[0.15]",
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
            "min-w-0 flex-1 bg-transparent px-1 text-foreground outline-none placeholder:text-tertiary-foreground",
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
