import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * CompactPagination — Figma "BO UI Kit" Compact Pagination(COMPONENT_SET 9705:87310)을 옮긴
 * 점(dot) 방식 페이지 인디케이터(캐러셀/온보딩 등). 숫자형 Pagination(9705:87844)과는 구조·
 * 의미가 달라 **별도 파일**로 분리(판단 근거는 스토리/보고 참조).
 *
 * Figma variant → prop 1:1 매핑 (평탄화 금지 규칙 준수):
 *  | Figma 변형   | 옵션               | prop                          |
 *  | Selected     | 1~5                | page (1-base, 제어/비제어)     |
 *  | Count        | 2,3,4,5,6+         | count (6+ = count>5 windowing) |
 *  | Ambient      | False/True         | ambient?: boolean              |
 *  | Time-based   | False/True         | timeBased?: boolean            |
 *
 * 값 매핑:
 *  - 컨테이너: gap 8(gap-2) · pad 8(p-2) · 높이 24(h-6) · rounded-full.
 *  - 점: 8×8(size-2) 원. Ambient=False → #2b7fff(bg-primary), 비선택 opacity 8%.
 *        Ambient=True  → #212226(bg-foreground), 비선택 opacity 24%(Figma 일부 변형은 25%/10% 로
 *        불일치 — 24% 로 통일, 보고됨).
 *  - Ambient=True 컨테이너: Figma 는 유리(glass) 머티리얼(BACKGROUND_BLUR 48 + noise, Solid
 *    폴백 #f7f8fa) → `bg-background/80 backdrop-blur-2xl` 로 근사(#f7f8fa ≈ --background #f8fafc, 보고됨).
 *  - Time-based=True: 선택 점이 20×8 트랙(rounded-full)으로 바뀌고 활성 바가 진행률만큼 채움
 *    (Figma 정적 값 12/20 = 60% → progress prop 기본 0.6).
 *
 * Count=6+ windowing 진리표 (Figma 5개 변형 전수 확인):
 *  | Selected(위치)   | 렌더(슬롯 5개)                              |
 *  | 1(첫)            | [●선택][●][●][●][·작은점]                   |
 *  | 2(둘째)          | [●][●선택][●][●][·]                         |
 *  | 3(중간)          | [·][●][●선택][●][·]                         |
 *  | 4(끝-1)          | [·][●][●][●선택][●]                         |
 *  | 5(끝)            | [·][●][●][●][●선택]                         |
 *  → 구현: 창 시작 = clamp(page-2, 1, count-4), 창 밖에 페이지가 남은 쪽 가장자리 점을
 *    6×6(size-1.5) 작은 점으로 렌더. count≤5 면 전부 표시.
 *
 * 접근성: <nav aria-label> + 점은 button(aria-label "n 페이지", 현재 aria-current="page").
 *
 * @see https://coss.com/ui/docs/components/pagination
 */
export interface CompactPaginationProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** 전체 페이지(점) 수 — Figma `Count`(6+ 는 count>5) */
  count: number;
  /** 현재 페이지(1-base, 제어) — Figma `Selected` */
  page?: number;
  /** 비제어 초기 페이지 */
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** 유리(blur) 배경 알약 — Figma `Ambient` */
  ambient?: boolean;
  /** 선택 점을 진행률 트랙으로 — Figma `Time-based` */
  timeBased?: boolean;
  /** timeBased 트랙 진행률 0~1 (기본 0.6 = Figma 정적 12/20) */
  progress?: number;
}

const CompactPagination = React.forwardRef<HTMLElement, CompactPaginationProps>(
  (
    {
      count,
      page,
      defaultPage = 1,
      onPageChange,
      ambient = false,
      timeBased = false,
      progress = 0.6,
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = page !== undefined;
    const [internal, setInternal] = React.useState(defaultPage);
    const current = Math.min(Math.max(isControlled ? page : internal, 1), count);

    const go = (p: number) => {
      if (!isControlled) setInternal(p);
      onPageChange?.(p);
    };

    // windowing: 최대 5개 슬롯, 창 밖 페이지가 남은 가장자리는 작은 점
    const windowSize = 5;
    const start =
      count <= windowSize ? 1 : Math.min(Math.max(current - 2, 1), count - (windowSize - 1));
    const visible = Array.from(
      { length: Math.min(windowSize, count) },
      (_, i) => start + i
    );
    const hasMoreLeft = start > 1;
    const hasMoreRight = start + visible.length - 1 < count;

    const dotColor = ambient ? "bg-foreground" : "bg-primary";
    const dimmed = ambient ? "opacity-[0.24]" : "opacity-[0.08]";

    return (
      <nav
        ref={ref}
        aria-label="페이지 인디케이터"
        data-node-id="9705:87310"
        className={cn(
          "inline-flex h-6 items-center gap-2 rounded-radius-full p-2",
          // Figma 유리 머티리얼(BACKGROUND_BLUR 48, Solid 폴백 #f7f8fa) 근사
          ambient && "bg-background/80 backdrop-blur-2xl",
          className
        )}
        {...props}
      >
        {visible.map((p, i) => {
          const isSelected = p === current;
          const isSmall =
            (i === 0 && hasMoreLeft) || (i === visible.length - 1 && hasMoreRight);

          if (isSelected && timeBased) {
            return (
              <span
                key={p}
                aria-current="page"
                aria-label={`${p} 페이지`}
                role="img"
                className="relative h-2 w-5 shrink-0"
              >
                <span className={cn("absolute inset-0 rounded-full", dotColor, dimmed)} />
                <span
                  className={cn("absolute inset-y-0 left-0 rounded-full", dotColor)}
                  style={{ width: `${Math.min(Math.max(progress, 0), 1) * 100}%` }}
                />
              </span>
            );
          }

          return (
            <button
              key={p}
              type="button"
              aria-label={`${p} 페이지`}
              aria-current={isSelected ? "page" : undefined}
              onClick={() => go(p)}
              className="inline-flex size-2 shrink-0 items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1 rounded-full"
            >
              <span
                className={cn(
                  "rounded-full transition-all",
                  dotColor,
                  isSmall ? "size-1.5" : "size-2",
                  !isSelected && dimmed
                )}
              />
            </button>
          );
        })}
      </nav>
    );
  }
);
CompactPagination.displayName = "CompactPagination";

export { CompactPagination };
