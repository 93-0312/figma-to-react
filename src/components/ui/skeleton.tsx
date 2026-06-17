import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Skeleton — Figma "BO UI Kit" Skeleton(node 7669:1885)의 로딩 플레이스홀더 프리미티브.
 *
 * Figma 의 Skeleton 노드는 아바타+텍스트+버튼이 배치된 **사용 예시**라, 재사용 가능한
 * 단위 프리미티브(펄스 애니메이션이 있는 muted 블록)로 만든다. 크기/모양은 className 으로 지정.
 * 배경색: Figma `muted`(#e2e8f0) = 프로젝트 `secondary` 토큰(우리 `muted`=foreground@4% 와 다름).
 *
 * @example <Skeleton className="h-10 w-10 rounded-full" />  // 아바타 자리
 */
export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-node-id="7669:1885"
      className={cn("animate-pulse rounded-radius-lg bg-secondary", className)}
      {...props}
    />
  )
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
