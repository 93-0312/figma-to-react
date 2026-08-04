import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * AspectRatio — Figma "BO UI Kit" Aspect Ratio 컴포넌트 세트(node 10178:8651).
 * 콘텐츠(주로 이미지)를 지정한 가로:세로 비율 상자에 맞춰 자른다.
 *
 * Figma variant/프로퍼티 → prop 매핑:
 * - `Ratio`(12종: 2:3 · 16:10 · 1.618:1 · 16:9 · 2:1 · 3:2 · 5:2 · 3:1 · 9:16 · 4:3 · 1:1 · 3:4)
 *   → `ratio` — 동일 표기의 `"W:H"` 문자열(프리셋 그대로) 또는 숫자(width/height). 기본 "16:10".
 * - `Mask#8564:0`(BOOLEAN, 기본 false) → `mask` — Figma 의 숨겨진 ALPHA 마스크 레이어
 *   (검정 50% 지점까지 불투명 → 100% 지점에서 투명, 세로 방향)를 CSS mask-image 로 재현.
 * - `Image#13974:0`(SLOT) → `children` — 슬롯 콘텐츠는 상자를 꽉 채우고(cover) 잘린다.
 *
 * 상자: radius 4(rounded-radius-sm) + overflow hidden (Figma clipsContent).
 */
export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 가로:세로 비율 — "16:9" 형태 문자열 또는 숫자(예: 16 / 9). 기본 "16:10" */
  ratio?: number | `${number}:${number}`;
  /** 하단 페이드아웃 마스크 (Figma Mask — 위 50% 불투명 → 아래로 투명) */
  mask?: boolean;
}

/** "W:H" 문자열 또는 숫자를 숫자 비율로 변환 (잘못된 값은 1) */
function parseRatio(ratio: number | string): number {
  if (typeof ratio === "number") {
    return Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
  }
  const [w, h] = ratio.split(":").map(Number);
  return Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0 ? w / h : 1;
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ className, ratio = "16:10", mask = false, style, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden rounded-radius-sm",
        mask &&
          "[mask-image:linear-gradient(to_bottom,#000_50%,transparent_100%)]",
        className
      )}
      style={{ aspectRatio: parseRatio(ratio), ...style }}
      data-node-id="10178:8651"
      {...props}
    >
      <div className="absolute inset-0 [&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover">
        {children}
      </div>
    </div>
  )
);
AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
