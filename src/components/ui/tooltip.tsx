import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Tooltip — Figma "BO UI Kit" Tooltip(node 5685:185). hover/focus 시 뜨는 힌트.
 *
 * 트리거를 감싸고, hover/focus 시 다크 칩 라벨을 표시(테두리/그림자 없음, radius-sm).
 * (2026-07-27 갱신: 기존 popover 흰 배경+테두리+shadow-overlay → bg-tooltip 다크 배경 단색으로 재설계.)
 * side top/right/bottom/left. CSS group-hover/focus-within 기반(경량). 내용 text-xs tooltip-foreground.
 *
 * 접근성: 툴팁에 useId 기반 id 를 달고 트리거(단일 엘리먼트면 cloneElement, 아니면 래퍼)에
 * aria-describedby 로 연결. Escape 로 포인터/포커스 이동 없이 닫을 수 있다(WCAG 1.4.13) —
 * hover 를 벗어났다 다시 올리면 재표시. 긴 내용은 max-w-xs 에서 줄바꿈된다.
 *
 * ── withCursor 확장 — Figma tooltip-withCursor(node 9695:27058) ──
 * `withCursor` 를 켜면 툴팁이 고정 side 대신 **마우스 커서를 따라** 표시된다.
 * Figma variant `Property 1` 1:1 매핑 (`cursorPlacement`):
 *  | Figma          | prop 값    | 칩 위치(핫스팟=커서 화살표 끝점 기준, Figma 지오메트리에서 도출) |
 *  |----------------|-----------|------------------------------------------------------------------|
 *  | tooltip-right  | "right"   | 커서 오른쪽 — dx +29px(커서박스 30−핫스팟 11 + gap 10), 세로중앙 +11px |
 *  | tooltip-left   | "left"    | 커서 왼쪽  — dx −21px(gap 10 + 핫스팟 11), 세로중앙 +11px          |
 *  | tooltip-middle | "middle"  | 커서 위 중앙 — dy −15px(gap 10 + 핫스팟 5), 가로중앙 +4px          |
 * Figma 의 "Cursor / Arrow" 그래픽은 실제 OS 마우스 커서를 표현한 에셋이므로 라이브 DOM 에는
 * 그리지 않는다(사용자 커서가 그 역할). 정적 시각 대조용으로 `TooltipCursorArrow` 를 export —
 * 스토리 갤러리에서 Figma 3개 variant 를 1:1 재현하는 데 쓴다.
 * 키보드 포커스 등 마우스 좌표가 없을 때는 기존 side 배치로 폴백한다.
 * 기존 API(content/side)와 기본 렌더는 변경 없음(withCursor 미지정 시 동일 DOM).
 */
export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "content"> {
  /** 툴팁 내용 */
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  /** Figma tooltip-withCursor — 마우스 커서를 따라다니는 툴팁 모드 */
  withCursor?: boolean;
  /** Figma `Property 1`: tooltip-right/left/middle → 커서 기준 칩 위치 (기본 "right") */
  cursorPlacement?: "right" | "left" | "middle";
}

const sidePos: Record<NonNullable<TooltipProps["side"]>, string> = {
  top: "bottom-full left-1/2 mb-1.5 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-1.5 -translate-x-1/2",
  left: "right-full top-1/2 mr-1.5 -translate-y-1/2",
  right: "left-full top-1/2 ml-1.5 -translate-y-1/2",
};

/** 커서 핫스팟(화살표 끝점) → 칩 오프셋/변환 — Figma 지오메트리(커서박스 30, gap 10, 핫스팟 (11,5)) */
const cursorPos: Record<
  NonNullable<TooltipProps["cursorPlacement"]>,
  { dx: number; dy: number; transform: string }
> = {
  right: { dx: 29, dy: 11, transform: "translateY(-50%)" },
  left: { dx: -21, dy: 11, transform: "translate(-100%, -50%)" },
  middle: { dx: 4, dy: -15, transform: "translate(-50%, -100%)" },
};

/**
 * Figma "Cursor / Arrow"(9695:27060) 30×30 마우스 커서 그래픽 — 흰 외곽선 + 검정 화살표
 * + drop-shadow(0 2px 2px 25%). 색은 커서 에셋 고유값이라 토큰 미적용(테마 무관).
 * 라이브 툴팁에는 쓰이지 않고, 디자인 1:1 시각 대조(갤러리)용.
 */
function TooltipCursorArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 30"
      className={cn("size-[30px]", className)}
      aria-hidden
      style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.25))" }}
    >
      <path d="M11 21.02V5L22.59 16.62H15.81L15.4 16.74L11 21.02Z" fill="white" />
      <path d="M20.08 21.69L16.48 23.22L11.8 12.13L15.48 10.58L20.08 21.69Z" fill="white" />
      <path d="M15.6526 13.6347L13.8085 14.4088L16.9048 21.7853L18.7489 21.0112L15.6526 13.6347Z" fill="black" />
      <path d="M12 7.41V18.6L14.97 15.73L15.4 15.59H20.16L12 7.41Z" fill="black" />
    </svg>
  );
}

const Tooltip = React.forwardRef<HTMLSpanElement, TooltipProps>(
  (
    { className, content, side = "top", withCursor = false, cursorPlacement = "right", children, ...props },
    ref
  ) => {
    const tooltipId = React.useId();
    const [dismissed, setDismissed] = React.useState(false);
    // withCursor 모드: 래퍼 기준 마우스 좌표(핫스팟). null 이면(키보드 포커스 등) side 폴백.
    const [cursor, setCursor] = React.useState<{ x: number; y: number } | null>(null);
    const wrapperRef = React.useRef<HTMLSpanElement>(null);
    React.useImperativeHandle(ref, () => wrapperRef.current as HTMLSpanElement);

    // 단일 엘리먼트 트리거에는 aria-describedby 를 직접 단다(포커스 요소에 연결돼야 낭독됨).
    const trigger = React.isValidElement(children)
      ? React.cloneElement(children as React.ReactElement, { "aria-describedby": tooltipId })
      : children;

    const pos = withCursor && cursor ? cursorPos[cursorPlacement] : null;

    return (
      <span
        ref={wrapperRef}
        aria-describedby={React.isValidElement(children) ? undefined : tooltipId}
        onKeyDown={(e) => {
          if (e.key === "Escape") setDismissed(true);
        }}
        // 재무장(re-arm)은 벗어날 때 + 다시 진입할 때 양쪽에 건다 — Escape 로 닫은 상태가
        // hover/focus 세션을 넘겨 고착되지 않게.
        onMouseEnter={() => setDismissed(false)}
        onMouseLeave={() => {
          setDismissed(false);
          if (withCursor) setCursor(null);
        }}
        onFocus={() => setDismissed(false)}
        onBlur={() => setDismissed(false)}
        onMouseMove={
          withCursor
            ? (e) => {
                const rect = wrapperRef.current?.getBoundingClientRect();
                if (rect) setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
              }
            : undefined
        }
        className={cn("group relative inline-flex", className)}
        {...props}
      >
        {trigger}
        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-50 w-max max-w-xs rounded-radius-sm bg-tooltip px-3 py-2 text-xs text-tooltip-foreground opacity-0 transition-opacity duration-150",
            !dismissed && "group-hover:opacity-100 group-focus-within:opacity-100",
            pos ? "transition-none" : sidePos[side]
          )}
          style={
            pos && cursor
              ? {
                  left: cursor.x + pos.dx,
                  top: cursor.y + pos.dy,
                  transform: pos.transform,
                }
              : undefined
          }
        >
          {content}
        </span>
      </span>
    );
  }
);
Tooltip.displayName = "Tooltip";

export { Tooltip, TooltipCursorArrow };
