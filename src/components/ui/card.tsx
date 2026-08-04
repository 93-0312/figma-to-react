import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Card — Figma "BO UI Kit" Card 컴포넌트(node 7757:807).
 *
 * Figma 구조: Card(세로 auto-layout, pad 24, gap 16, bg card, border 1px #e6eaf0,
 * radius 16, shadow-xs) 안에 슬롯(slot-card-container)이 있고, 슬롯 예시 콘텐츠로
 * Header(Title 18/28 medium + Description 14/20, gap 2) / Field / Button /
 * InformationRow 가 배치돼 있다. 슬롯 콘텐츠는 자유 조합이므로 children 으로 받는다.
 *
 * 파트:
 *  - Card            : 컨테이너 (p-6, gap-4, rounded-radius-2xl, border-border, bg-card, shadow-xs)
 *  - CardHeader      : 제목 묶음 (세로, gap 2 — Figma Header 7757:510)
 *  - CardTitle       : 18/28 medium, letterSpacing -0.18 (Figma 7757:511)
 *  - CardDescription : 14/20, tertiary-foreground #8d95a2 (Figma 7757:512)
 *
 * 색 매핑 주의: Figma Title fill 은 #121317 로 코드 토큰과 정확히 일치하는 값이 없어
 * 가장 가까운 card-foreground(#020618) 를 상속받게 두었다(새 토큰 발명 금지 규칙).
 */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-node-id="7757:807"
      className={cn(
        "flex w-full flex-col gap-4 rounded-radius-2xl border border-border bg-card p-6 text-card-foreground shadow-xs",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-0.5", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-lg font-medium leading-7 tracking-[-0.18px]", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-tertiary-foreground", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

export { Card, CardHeader, CardTitle, CardDescription };
