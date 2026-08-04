import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Fieldset — Figma "BO UI Kit" Fieldset 컴포넌트(node 7759:1108).
 *
 * Figma 구조: Fieldset(세로) > 슬롯(slot-fields, gap 16) 안에
 * Texts(Title 18/28 medium, gap 2) + Field 인스턴스들이 쌓이는 폼 섹션 래퍼.
 * 슬롯 콘텐츠(Field/Input 조합)는 children 으로 받는다.
 *
 * 접근성: 네이티브 `<fieldset>` + `<legend>` 를 사용한다. 항목 간 16px 간격은
 * legend 가 flex 아이템으로 취급되지 않는 브라우저 특성을 피하려고 `space-y-4`
 * (마진 방식)로 구현했다 — legend 다음 첫 필드에도 동일한 16px 이 적용된다.
 *
 * 색 매핑 주의: Figma Title fill #2f3034 은 코드 토큰과 정확히 일치하는 값이 없어
 * 가장 가까운 foreground(#212226) 토큰을 사용(새 토큰 발명 금지 규칙).
 */
const Fieldset = React.forwardRef<
  HTMLFieldSetElement,
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>
>(({ className, ...props }, ref) => (
  <fieldset
    ref={ref}
    data-node-id="7759:1108"
    className={cn("m-0 w-full min-w-0 space-y-4 border-0 p-0", className)}
    {...props}
  />
));
Fieldset.displayName = "Fieldset";

/** Fieldset 제목 (Figma Texts>Title 7759:962 — 18/28 medium, letterSpacing -0.18) */
const FieldsetLegend = React.forwardRef<
  HTMLLegendElement,
  React.HTMLAttributes<HTMLLegendElement>
>(({ className, ...props }, ref) => (
  <legend
    ref={ref}
    className={cn("p-0 text-lg font-medium leading-7 tracking-[-0.18px] text-foreground", className)}
    {...props}
  />
));
FieldsetLegend.displayName = "FieldsetLegend";

export { Fieldset, FieldsetLegend };
