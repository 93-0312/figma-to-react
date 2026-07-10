import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Skeleton — Figma "BO UI Kit" Skeleton(node 7669:1885)의 로딩 플레이스홀더 프리미티브.
 *
 * Figma 의 Skeleton 노드는 아바타+텍스트+버튼이 배치된 **사용 예시**라, 재사용 가능한
 * 단위 프리미티브(펄스 애니메이션이 있는 블록)로 만든다. 크기/모양은 className 으로 지정.
 * 배경색: 아바타/텍스트/버튼 샘플 모두 동일하게 Figma `disabled`(#45556c, VariableID:5632:2356)
 * 를 8% 불투명도로 사용(흰 배경 위에서 옅은 회색으로 보임). (2026-07 Figma 갱신: 이전 문서상
 * `secondary`(#e2e8f0) 근사값이었으나, 실제 바인딩은 `disabled@8%` 로 확인됨.)
 *
 * @example <Skeleton className="h-10 w-10 rounded-full" />  // 아바타 자리
 */
export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-node-id="7669:1885"
      className={cn("animate-pulse rounded-radius-lg bg-disabled/[0.08]", className)}
      {...props}
    />
  )
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
