import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Empty — Figma "BO UI Kit" Empty 컴포넌트(node 7656:2017). 빈 상태(empty state) 플레이스홀더.
 *
 * 구조(Figma): [IconFrame(카드 3장 스택: Left −10°/Right +10°/Main) → Texts(Title·Description)
 * → Buttons(액션 행, gap 8)] 를 세로 스택(gap 24, pad 48, 가운데 정렬)으로 배치.
 *
 * Figma 프로퍼티 → prop 매핑:
 * - `Icon#7656:0`(INSTANCE_SWAP, 기본 solid/x-mark) → `icon` (ReactNode, 기본 X 아이콘)
 * - `Title#7656:1`(TEXT) → `title`
 * - `Description#7656:2`(TEXT) → `description`
 * - `ShowDescription#7656:6`(BOOLEAN) → `showDescription`
 * - `ShowButtons#7656:5`(BOOLEAN) → `showButtons` (children = 액션 버튼 슬롯)
 * - `ShowPrimaryButton#7656:4` / `ShowSecondaryButton#7656:3` → 소비자가 children 으로
 *   어떤 버튼을 넣을지 결정(고정 2버튼을 코드에 박지 않고 슬롯으로 개방)
 *
 * 상태 진리표:
 * | showDescription | showButtons | children | 렌더 |
 * |---|---|---|---|
 * | true  | true  | 있음 | 아이콘 + 제목 + 설명 + 버튼행 |
 * | false | true  | 있음 | 아이콘 + 제목 + 버튼행 |
 * | true  | false | 있음 | 아이콘 + 제목 + 설명 (버튼행 숨김) |
 * | *     | true  | 없음 | 버튼행 자체가 렌더되지 않음 |
 */
export interface EmptyProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 상단 카드 스택 안의 아이콘 (기본: X 마크, currentColor) */
  icon?: React.ReactNode;
  /** 제목 (Figma Title, 20px/28 semibold). HTMLAttributes 의 title(string 툴팁)을 ReactNode 로 대체 */
  title?: React.ReactNode;
  /** 설명 (Figma Description, 14px/20 muted) */
  description?: React.ReactNode;
  /** 설명 표시 여부 (Figma ShowDescription) */
  showDescription?: boolean;
  /** 액션 버튼 행 표시 여부 (Figma ShowButtons) */
  showButtons?: boolean;
}

/** Figma 기본 아이콘 solid/x-mark(1637:5479) 대응 인라인 SVG */
function XMarkIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="m5.2 5.2 9.6 9.6m0-9.6-9.6 9.6" strokeLinecap="round" />
    </svg>
  );
}

const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  (
    {
      className,
      icon,
      title,
      description,
      showDescription = true,
      showButtons = true,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn("flex flex-col items-center gap-6 p-12 text-center", className)}
      data-node-id="7656:2017"
      {...props}
    >
      {/* IconFrame — 카드 3장 스택 (Left −10° / Right +10° / Main) */}
      <div aria-hidden className="relative size-9">
        <div className="absolute -left-1 top-0.5 size-[30px] -rotate-[10deg] rounded-radius-lg border border-border bg-card shadow-xs" />
        <div className="absolute left-[10px] top-0.5 size-[30px] rotate-[10deg] rounded-radius-lg border border-border bg-card shadow-xs" />
        <div className="absolute inset-0 flex items-center justify-center rounded-radius-lg border border-border bg-card text-foreground shadow-xs [&_svg]:size-5">
          {icon ?? <XMarkIcon />}
        </div>
      </div>
      {/* Texts */}
      <div className="flex flex-col items-center gap-1 self-stretch">
        {title != null ? (
          // Figma: 20px/28 weight 600, letterSpacing -0.2px (타이포 토큰엔 xl 이 없어 Tailwind 기본 text-xl 사용)
          <div className="text-xl font-semibold tracking-[-0.01em] text-foreground">{title}</div>
        ) : null}
        {showDescription && description != null ? (
          <div className="text-sm text-muted-foreground">{description}</div>
        ) : null}
      </div>
      {/* Buttons — 액션 슬롯 (Figma: PrimaryButton + Outline Button, gap 8) */}
      {showButtons && children != null ? (
        <div className="flex items-center gap-2">{children}</div>
      ) : null}
    </div>
  )
);
Empty.displayName = "Empty";

export { Empty };
