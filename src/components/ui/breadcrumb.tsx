import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Breadcrumb — Figma "BO UI Kit" Breadcrumb(node 5665:4391). 현재 위치 경로 표시.
 *
 * 항목들을 구분자(chevron/slash)로 연결. 링크(href 있음)/구분자=tertiary-foreground, 마지막(현재)=foreground.
 * (2026-07-27 갱신: 기존 muted-foreground@50% 근사 대신 전용 불투명 토큰 tertiary-foreground 로 재바인딩.)
 * Type: Chevron(›) / Slash(/). text-sm. items 배열 API.
 */
export interface BreadcrumbItemData {
  label: React.ReactNode;
  href?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItemData[];
  separator?: "chevron" | "slash";
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className="size-4 shrink-0">
      <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, items, separator = "chevron", ...props }, ref) => (
    <nav ref={ref} aria-label="breadcrumb" data-node-id="5665:4391" className={cn("flex items-center", className)} {...props}>
      <ol className="flex items-center gap-1 text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <a href={item.href} className="text-tertiary-foreground transition-colors hover:text-foreground">
                  {item.label}
                </a>
              ) : (
                <span className={isLast ? "text-foreground" : "text-tertiary-foreground"} aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast &&
                (separator === "slash" ? (
                  <span className="text-tertiary-foreground" aria-hidden>/</span>
                ) : (
                  <span className="text-tertiary-foreground" aria-hidden>
                    <ChevronRight />
                  </span>
                ))}
            </li>
          );
        })}
      </ol>
    </nav>
  )
);
Breadcrumb.displayName = "Breadcrumb";

export { Breadcrumb };
