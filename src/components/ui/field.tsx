import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Field — Figma "BO UI Kit" Field 컴포넌트(node 7745:713)를 옮긴 폼 필드 래퍼.
 *
 * 구조: [Label(+필수 *)] + [컨트롤(children)] + [보조 영역].
 * Figma 의 `Type` 변형(상호 배타) → 보조 영역의 종류로 매핑:
 *  | Type        | 보조 영역 렌더                                            |
 *  | Default     | 없음                                                      |
 *  | Error       | <p> 에러 텍스트 (destructive-foreground 빨강, text-xs)   |
 *  | Description | <p> 설명 텍스트 (muted-foreground, text-xs)               |
 *  | Validity    | muted 배경 박스(radius-lg) + 텍스트 (foreground, text-xs) |
 *
 * 보조 텍스트는 error 가 우선(error 가 있으면 description 은 숨김). validity 박스는 독립.
 * label/control gap = 6px(spacing/1-5), 보조 영역과의 gap = 8px(spacing/2).
 *
 * 참고(의도된 디자인 변환): Figma label 토큰은 Inter Medium 이지만, 이 프로젝트는
 * sans 를 Pretendard 로 표준화하므로 `font-medium`(Pretendard Medium)으로 옮긴다.
 *
 * @see https://coss.com/ui/docs/components/field
 */
export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  /** 필수 표시(*) */
  required?: boolean;
  /** 컨트롤과 label 을 연결할 id (label htmlFor + 권장: 컨트롤 id 동일) */
  htmlFor?: string;
  /** 회색 설명 텍스트 */
  description?: React.ReactNode;
  /** 빨간 에러 텍스트 (있으면 description 대신 표시) */
  error?: React.ReactNode;
  /** muted 배경 박스 안내 */
  validity?: React.ReactNode;
  /** 폼 컨트롤 (Input, Select 등) */
  children?: React.ReactNode;
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  (
    { className, label, required = false, htmlFor, description, error, validity, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex w-full flex-col gap-2", className)}
        data-node-id="7745:713"
        {...props}
      >
        {/* Container: label + control */}
        <div className="flex flex-col gap-1.5">
          {label != null && (
            <label
              htmlFor={htmlFor}
              className="flex items-center gap-1.5 text-sm font-medium leading-5 text-foreground"
            >
              {label}
              {required && (
                <span className="text-success-foreground" aria-hidden>
                  *
                </span>
              )}
            </label>
          )}
          {children}
        </div>

        {/* 보조 영역 */}
        {error != null ? (
          <p className="text-xs leading-[14px] tracking-[0.12px] text-destructive-foreground">
            {error}
          </p>
        ) : description != null ? (
          <p className="text-xs leading-[14px] tracking-[0.12px] text-muted-foreground">
            {description}
          </p>
        ) : null}

        {validity != null && (
          <div className="rounded-radius-lg bg-muted p-2">
            <p className="text-xs leading-[14px] tracking-[0.12px] text-foreground">
              {validity}
            </p>
          </div>
        )}
      </div>
    );
  }
);
Field.displayName = "Field";

export { Field };
