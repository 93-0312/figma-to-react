import * as React from "react";
import { cn } from "../../lib/utils";
import { Input, inputVariants, type InputProps } from "./input";
import { Spinner } from "./spinner";

/**
 * InputGroup — Figma "BO UI Kit" Input Group 세트(node 7857:9348).
 *
 * 기존 `Input` 을 합성(재구현 금지)해 Figma `Additional` variant 8종을 표현한다.
 * Figma variant → prop 1:1 매핑 (variant 는 상호 배타지만 코드에선 조합 가능):
 *  | Additional        | 노드 id    | prop / 사용법                                       |
 *  | Default           | 7857:9347 | `leftIcon` (기존 Input prop — 예: 검색 아이콘)      |
 *  | EndIcon           | 7857:9345 | `rightIcon` (기존 Input prop)                       |
 *  | StartAndEndText   | 7857:9344 | `prefix` / `suffix` (기존 Input prop)               |
 *  | Button            | 7857:9342 | `button` — 우측 인라인 액션 (예: <Button size="xs">) |
 *  | Badge             | 7857:9346 | `badge` — 우측 Badge                                |
 *  | KeyboardShortcut  | 7857:9341 | `kbd` — 우측 단축키 칩 (<InputGroupKbd>)            |
 *  | LoadingSpinner    | 7857:9343 | `loading` — 우측 16px Spinner + disabled(64%)       |
 *  | InnerLabel        | 7857:9340 | `innerLabel` — 내부 상단 라벨(Large 세로 레이아웃)  |
 *
 * InnerLabel 레이아웃(Figma Input Type=InnerLabel/Size=Large, 총 60px):
 * 컨테이너 py-2 px-2 gap-1, 1행 = [라벨 14/20 foreground][rightIcon 16px],
 * 2행 = 값 입력(14/20). 이때 `rightIcon` 은 1행 우측에 배치된다.
 *
 * 색 매핑 주의: Kbd 칩 텍스트 #686f7a 는 일치하는 토큰이 없어 가장 가까운
 * muted-foreground 를 사용, 배경 #eff2f7 은 accent 토큰과 정확히 일치.
 */
export interface InputGroupProps extends InputProps {
  /** Additional=Button — 인풋 우측 인라인 버튼 (권장: <Button size="xs">) */
  button?: React.ReactNode;
  /** Additional=Badge — 인풋 우측 Badge */
  badge?: React.ReactNode;
  /** Additional=KeyboardShortcut — 인풋 우측 단축키 칩 (권장: <InputGroupKbd>) */
  kbd?: React.ReactNode;
  /** Additional=LoadingSpinner — 우측 스피너 표시 + 입력 비활성화 */
  loading?: boolean;
  /** Additional=InnerLabel — 인풋 내부 상단 라벨 (세로 Large 레이아웃으로 전환) */
  innerLabel?: React.ReactNode;
}

const InputGroup = React.forwardRef<HTMLInputElement, InputGroupProps>(
  (
    {
      button,
      badge,
      kbd,
      loading = false,
      innerLabel,
      rightIcon,
      suffix,
      invalid = false,
      disabled,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const effectiveRightIcon = loading ? (
      <Spinner size="sm" aria-label="loading" />
    ) : (
      rightIcon
    );

    // Additional=InnerLabel — 세로 Large 레이아웃 (컨테이너가 테두리/링을 담당)
    if (innerLabel != null) {
      return (
        <div
          data-node-id="7857:9340"
          className={cn(
            inputVariants({ inputSize: "md", invalid }),
            "h-auto flex-col items-stretch gap-1 py-2",
            containerClassName
          )}
        >
          <span className="flex items-center gap-1">
            <span className="min-w-0 flex-1 truncate px-1 text-sm text-foreground">
              {innerLabel}
            </span>
            {effectiveRightIcon != null && (
              <span className="inline-flex shrink-0 opacity-80 [&_svg]:size-4">
                {effectiveRightIcon}
              </span>
            )}
          </span>
          <Input
            ref={ref}
            disabled={isDisabled}
            containerClassName="h-5 rounded-none border-0 bg-transparent p-0 shadow-none focus-within:ring-0 has-[:disabled]:opacity-100"
            {...props}
          />
        </div>
      );
    }

    // 그 외 variant — 기존 Input 에 우측 애드온을 suffix 슬롯으로 합성
    const addon =
      button != null || badge != null || kbd != null ? (
        <span className="-mr-1 inline-flex shrink-0 items-center gap-1">
          {badge}
          {kbd}
          {button}
        </span>
      ) : null;

    return (
      <Input
        ref={ref}
        invalid={invalid}
        disabled={isDisabled}
        rightIcon={effectiveRightIcon}
        containerClassName={containerClassName}
        suffix={
          suffix != null || addon != null ? (
            <>
              {suffix}
              {addon}
            </>
          ) : undefined
        }
        {...props}
      />
    );
  }
);
InputGroup.displayName = "InputGroup";

/**
 * InputGroupKbd — 인풋 내부 키보드 단축키 칩 (Figma Kbd 7762:788).
 * bg accent(#eff2f7) / radius-sm(4) / 12/16 medium / min 20px.
 */
const InputGroupKbd = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-radius-sm bg-accent px-1 font-sans text-xs font-medium leading-4 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);
InputGroupKbd.displayName = "InputGroupKbd";

export { InputGroup, InputGroupKbd };
