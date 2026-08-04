import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Form — Figma "BO UI Kit" Form(node 7759:1314)을 옮긴 폼 레이아웃 컨테이너.
 *
 * Figma 구조: VERTICAL · gap 16(gap-4) · 폭 채움 — 컴포넌트 자체는 slot-form-items(SLOT)
 * 하나만 가진 순수 레이아웃이다(변형 없음). 예시 슬롯 구성은 Field ×2 + Button(Size=Default,
 * 폭 채움) — 기존 Field(field.tsx)/Input/Select/Button 을 children 으로 합성한다.
 * (SLOT preferredValues 도 Field/Input 계열 COMPONENT_SET 3종을 가리킨다.)
 *
 * 시맨틱: 네이티브 <form> 으로 렌더 — submit/reset, 폼 접근성(레이블 연결은 Field 가 담당)을
 * 브라우저 기본으로 얻는다.
 *
 * @see https://coss.com/ui/docs/components/form
 */
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, ...props }, ref) => (
    <form
      ref={ref}
      data-node-id="7759:1314"
      className={cn("flex w-full flex-col gap-4", className)}
      {...props}
    />
  )
);
Form.displayName = "Form";

export { Form };
