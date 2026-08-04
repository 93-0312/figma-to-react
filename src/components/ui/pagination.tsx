import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Pagination — Figma "BO UI Kit" Pagination(node 9705:87844)을 옮긴 숫자 페이지네이션.
 * [이전] [1][2][3] … [다음] 형태의 40×40 셀 나열.
 *
 * Figma 값 매핑:
 *  - 셀: 40×40(size-10) · radius 12(rounded-radius-xl) · 셀 간격 8(gap-2) · 라벨 16/24 medium(text-base font-medium).
 *  - 비활성 페이지: border 1px #e6eaf0(border-border) · 텍스트 #212226(text-foreground, VariableID:5632:2333).
 *  - 활성 페이지: 채움 #262626(bg-tooltip, VariableID:5632:2340 — tooltip 배경과 동일 변수) · 테두리 없음.
 *    ⚠️ Figma 는 활성 셀의 텍스트도 foreground(#212226) 로 바인딩해 두어 다크 배경 위 다크 텍스트가 된다
 *    (렌더 이미지에서도 동일). 디자인 원본을 그대로 따르되, 가독성 이슈로 보고됨 — 의도가 흰 텍스트라면
 *    Figma 쪽 재바인딩 후 `text-tooltip-foreground` 로 교체.
 *  - 셰브론/말줄임(…) 점: #e6eaf0(text-border/bg-border, VariableID:5632:2356 — 값이 --border 와 동일해 border 토큰으로 매핑).
 *  - 말줄임: 3×3 점 3개 · 점 간격 2(gap-0.5).
 *
 * 동작: page/defaultPage/onPageChange 제어·비제어. 경계에서 이전/다음 disabled.
 * 페이지 수가 많으면 표준 windowing(경계 boundaryCount + 현재 주변 siblingCount + …)으로 축약.
 * (hover: Figma 에 hover 변형 없음 — 프로젝트 관례(Button outline)를 따라 bg-secondary/50 근사.)
 *
 * 접근성: <nav aria-label> + 활성 페이지 aria-current="page". 이전/다음은 aria-label 버튼.
 *
 * @see https://coss.com/ui/docs/components/pagination
 */
const paginationItemVariants = cva(
  "inline-flex size-10 shrink-0 select-none items-center justify-center rounded-radius-xl text-base font-medium transition-colors outline-none " +
    "focus-visible:ring-[3px] focus-visible:ring-offset-0 focus-visible:ring-disabled/[0.07] " +
    "disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      active: {
        // ⚠️ 텍스트 색은 Figma 바인딩 그대로 foreground — JSDoc 의 가독성 주의 참고.
        true: "bg-tooltip text-foreground",
        false: "border border-border text-foreground hover:bg-secondary/50",
      },
    },
    defaultVariants: { active: false },
  }
);

function Chevron({ direction }: { direction: "back" | "forward" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={cn("size-4", direction === "back" && "rotate-180")}
      aria-hidden
    >
      <path d="m6 3.5 4.5 4.5L6 12.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 표시할 항목 계산: 숫자 페이지 또는 말줄임 */
export type PaginationItem = number | "ellipsis";

export function getPaginationItems(
  page: number,
  pageCount: number,
  siblingCount = 1,
  boundaryCount = 1
): PaginationItem[] {
  const range = (from: number, to: number) =>
    Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);
  // 축약 없이 전부 표시 가능한 경우
  const total = boundaryCount * 2 + siblingCount * 2 + 3; // 경계×2 + 형제×2 + 현재 + …자리 2
  if (pageCount <= total) return range(1, pageCount);

  const start = range(1, boundaryCount);
  const end = range(pageCount - boundaryCount + 1, pageCount);
  const siblingStart = Math.max(
    Math.min(page - siblingCount, pageCount - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2
  );
  const siblingEnd = siblingStart + siblingCount * 2;
  const items: PaginationItem[] = [...start];
  items.push(siblingStart > boundaryCount + 2 ? "ellipsis" : boundaryCount + 1);
  items.push(...range(siblingStart, siblingEnd));
  items.push(siblingEnd < pageCount - boundaryCount - 1 ? "ellipsis" : pageCount - boundaryCount);
  items.push(...end);
  return items;
}

export interface PaginationProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** 전체 페이지 수 */
  pageCount: number;
  /** 현재 페이지(1-base, 제어) */
  page?: number;
  /** 비제어 초기 페이지 */
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** 현재 페이지 양옆에 표시할 페이지 수 (기본 1) */
  siblingCount?: number;
  /** 시작/끝에 항상 표시할 페이지 수 (기본 1) */
  boundaryCount?: number;
}

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      pageCount,
      page,
      defaultPage = 1,
      onPageChange,
      siblingCount = 1,
      boundaryCount = 1,
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = page !== undefined;
    const [internal, setInternal] = React.useState(defaultPage);
    const current = Math.min(Math.max(isControlled ? page : internal, 1), pageCount);

    const go = (p: number) => {
      const next = Math.min(Math.max(p, 1), pageCount);
      if (!isControlled) setInternal(next);
      onPageChange?.(next);
    };

    const items = getPaginationItems(current, pageCount, siblingCount, boundaryCount);

    return (
      <nav
        ref={ref}
        aria-label="페이지네이션"
        data-node-id="9705:87844"
        className={cn("flex items-center justify-center gap-2", className)}
        {...props}
      >
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={current <= 1}
          onClick={() => go(current - 1)}
          className={cn(paginationItemVariants({ active: false }), "text-border")}
        >
          <Chevron direction="back" />
        </button>

        {items.map((item, i) =>
          item === "ellipsis" ? (
            <span
              key={`e-${i}`}
              aria-hidden
              className="inline-flex size-10 items-end justify-center gap-0.5 rounded-radius-xl pb-[15px]"
            >
              <span className="size-[3px] rounded-full bg-border" />
              <span className="size-[3px] rounded-full bg-border" />
              <span className="size-[3px] rounded-full bg-border" />
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-current={item === current ? "page" : undefined}
              aria-label={`${item} 페이지`}
              onClick={() => go(item)}
              className={paginationItemVariants({ active: item === current })}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          aria-label="다음 페이지"
          disabled={current >= pageCount}
          onClick={() => go(current + 1)}
          className={cn(paginationItemVariants({ active: false }), "text-border")}
        >
          <Chevron direction="forward" />
        </button>
      </nav>
    );
  }
);
Pagination.displayName = "Pagination";

export { Pagination, paginationItemVariants };
