import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * InputOTP — Figma "BO UI Kit" Input OTP 컴포넌트(node 8060:1580)를 옮긴 슬롯형 OTP 입력.
 *
 * 구조: [title] + [슬롯 행: InputOTPSlot×N (+ InputOTPSeparator)] + [belowText].
 * 슬롯은 children 으로 합성한다(Input/Field 와 동일한 슬롯형 접근). 6자리 3-3 그룹이
 * 기본 디자인이며, 가운데에 InputOTPSeparator 를 넣는다.
 *
 * 변형(Figma): IsLarge(False=32px / True=36px) → `isLarge` prop.
 *  - isLarge 는 context 로 하위 InputOTPSlot 에 전파된다(슬롯마다 따로 줄 필요 없음).
 *  - 개별 슬롯에서 `isLarge` 를 직접 주면 context 보다 우선한다.
 *
 * @see https://coss.com/ui/docs/components/input-otp
 */

const OtpLargeContext = React.createContext<boolean>(false);

export interface InputOTPProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 큰 사이즈(슬롯 36px). 기본 false(32px). Figma IsLarge 변형 */
  isLarge?: boolean;
  /** 상단 제목 텍스트 */
  title?: string;
  /** 제목 표시 여부 */
  showTitle?: boolean;
  /** 하단 안내 텍스트 */
  belowText?: string;
  /** 하단 안내 표시 여부 */
  showBelowText?: boolean;
}

const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  (
    {
      className,
      isLarge = false,
      title = "Verification code",
      showTitle = true,
      belowText = "Enter the 6-digit code sent to your email.",
      showBelowText = true,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <OtpLargeContext.Provider value={isLarge}>
        <div
          ref={ref}
          className={cn("flex flex-col items-center gap-2", className)}
          data-node-id="8060:1580"
          {...props}
        >
          {showTitle ? (
            <p className="w-full text-center text-sm font-medium text-foreground">
              {title}
            </p>
          ) : null}
          <div className="flex items-center justify-center gap-2">{children}</div>
          {showBelowText ? (
            <p className="w-full text-center text-xs text-muted-foreground">
              {belowText}
            </p>
          ) : null}
        </div>
      </OtpLargeContext.Provider>
    );
  }
);
InputOTP.displayName = "InputOTP";

const slotVariants = cva(
  "relative flex shrink-0 items-center justify-center rounded-radius border bg-card text-sm text-foreground shadow-xs transition-[color,box-shadow]",
  {
    variants: {
      isLarge: { true: "size-9", false: "size-8" },
      // active = 다음 입력 위치(캐럿). 슬롯이 Input 의 "Type=Focus" 인스턴스를 그대로 쓰므로
      // Input 과 동일한 primary/ring 파랑 테두리 + 3px/15% 글로우 링이다.
      // (2026-07 Figma 갱신: 이전엔 disabled 회색 링이었으나 primary/ring 파랑으로 재바인딩됨.)
      active: {
        true: "z-10 border-ring ring-[3px] ring-ring/[0.15]",
        false: "border-input",
      },
    },
    defaultVariants: { isLarge: false, active: false },
  }
);

export interface InputOTPSlotProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof slotVariants>, "isLarge"> {
  /** 표시할 글자(채워진 숫자). 없으면 빈 슬롯 */
  char?: React.ReactNode;
  /** 사이즈 오버라이드(미지정 시 InputOTP 의 isLarge context 사용) */
  isLarge?: boolean;
}

/**
 * InputOTPSlot — 한 자리 입력 칸.
 * 상태 진리표: 기본=빈칸(border-input) · char 있음=글자 표시(foreground) · active=링(다음 입력 위치).
 */
const InputOTPSlot = React.forwardRef<HTMLDivElement, InputOTPSlotProps>(
  ({ className, char, active = false, isLarge, ...props }, ref) => {
    const ctxLarge = React.useContext(OtpLargeContext);
    const large = isLarge ?? ctxLarge;
    return (
      <div
        ref={ref}
        className={cn(slotVariants({ isLarge: large, active }), className)}
        {...props}
      >
        {char != null ? <span className="text-center">{char}</span> : null}
      </div>
    );
  }
);
InputOTPSlot.displayName = "InputOTPSlot";

/** InputOTPSeparator — 슬롯 그룹 사이의 짧은 구분선(Figma 12px 점선 대시). */
const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn("flex w-3 shrink-0 items-center justify-center", className)}
    {...props}
  >
    <div className="h-0.5 w-full rounded-full bg-border" />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPSlot, InputOTPSeparator, slotVariants };
