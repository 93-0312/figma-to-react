import * as React from "react";
import { cn } from "../../lib/utils";
import { useControllableOpen, useFocusTrap, useA11yIds, useRegisterPresence } from "./overlay";

/**
 * Popover — Figma "BO UI Kit" Popover(node 7751:2411)를 옮긴 비모달 플로팅 패널.
 * 트리거 근처에 떠서 임의 콘텐츠(폼/텍스트 등)를 담는다.
 *
 * 합성: Popover > PopoverTrigger + PopoverContent > PopoverHeader(PopoverTitle/PopoverDescription) + 임의 children.
 * Figma 구조 매핑:
 *  - 패널: w-80(320) · p-4(16) · gap-3(12) · bg-popover · rounded-radius(10) · shadow-overlay
 *    (DROP 0/4/6/-4 5% + 0/10/15/-3 5% = 기존 `shadow-overlay` 토큰과 동일값).
 *  - 테두리: Figma 는 별도 "Background" 오버레이 프레임의 0.5px #e6eaf0 스트로크 @ opacity 50%
 *    → `border border-border/50` 로 근사(0.5px 는 웹에서 1px 로 — 값 차이는 보고됨).
 *  - Title(TEXT prop) → PopoverTitle: 14/20 medium foreground.
 *  - Description(TEXT prop) → PopoverDescription: 14/20 regular muted-foreground(#0f172b@50%).
 *  - Texts 프레임(gap 4) → PopoverHeader(gap-1).
 *  - slot-popover-items(SLOT) → PopoverContent 의 children (Figma 예시는 Textarea + Button).
 *
 * 동작/접근성: 트리거 aria-haspopup="dialog" + aria-expanded + aria-controls. 클릭 토글,
 * 바깥 클릭/ESC 로 닫힘(ESC 는 트리거로 포커스 복귀 — useFocusTrap 의 복원 로직 재사용).
 * 패널 role="dialog" + aria-labelledby/describedby(제목/설명이 렌더된 경우에만).
 *
 * ※ overlay.tsx `useOverlayBehavior` 는 재사용하지 않음(문서화된 결정) — body 스크롤 잠금이
 *   비모달 팝오버 UX 에 부적합. ESC 닫기는 패널 로컬 keydown 으로 처리한다.
 *   포지셔닝은 Select 패널과 동일하게 포털 없이 relative 루트 + absolute(top-full) 방식.
 *
 * @see https://coss.com/ui/docs/components/popover
 */
interface PopoverCtx {
  open: boolean;
  setOpen: (o: boolean) => void;
  panelId: string;
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>;
  titleId: string;
  descId: string;
  setHasTitle: (v: boolean) => void;
  setHasDesc: (v: boolean) => void;
  labelProps: { "aria-labelledby"?: string; "aria-describedby"?: string };
}
const Ctx = React.createContext<PopoverCtx | null>(null);
const usePopover = () => {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("Popover parts must be used within <Popover>");
  return c;
};

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  ({ open, defaultOpen = false, onOpenChange, className, children, ...props }, ref) => {
    const [value, setValue] = useControllableOpen(open, defaultOpen, onOpenChange);
    const a11y = useA11yIds();
    const panelId = React.useId();
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const mergeRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    // 바깥 클릭으로 닫기 (select.tsx 와 동일 패턴)
    React.useEffect(() => {
      if (!value) return;
      const onPointerDown = (e: MouseEvent) => {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
          setValue(false);
        }
      };
      document.addEventListener("mousedown", onPointerDown);
      return () => document.removeEventListener("mousedown", onPointerDown);
    }, [value, setValue]);

    return (
      <Ctx.Provider value={{ open: value, setOpen: setValue, panelId, triggerRef, ...a11y }}>
        <div
          ref={mergeRef}
          className={cn("relative inline-block", className)}
          data-node-id="7751:2411"
          {...props}
        >
          {children}
        </div>
      </Ctx.Provider>
    );
  }
);
Popover.displayName = "Popover";

const PopoverTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ onClick, ...props }, ref) => {
    const { open, setOpen, panelId, triggerRef } = usePopover();
    const mergeRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      [ref, triggerRef]
    );
    return (
      <button
        ref={mergeRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={(e) => {
          setOpen(!open);
          onClick?.(e);
        }}
        {...props}
      />
    );
  }
);
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ onClick, ...props }, ref) => {
    const { setOpen } = usePopover();
    return (
      <button
        ref={ref}
        type="button"
        onClick={(e) => {
          setOpen(false);
          onClick?.(e);
        }}
        {...props}
      />
    );
  }
);
PopoverClose.displayName = "PopoverClose";

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 트리거 기준 가로 정렬 (기본 start) */
  align?: "start" | "center" | "end";
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, align = "start", onKeyDown, children, ...props }, ref) => {
    const { open, setOpen, panelId, labelProps } = usePopover();
    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const mergeRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        panelRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );
    // 열림 시 패널로 포커스 이동 + Tab 순환, 닫힘 시 트리거로 포커스 복원
    useFocusTrap(open, panelRef);
    if (!open) return null;
    return (
      <div
        ref={mergeRef}
        role="dialog"
        id={panelId}
        tabIndex={-1}
        {...labelProps}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            setOpen(false); // 포커스 복원은 useFocusTrap cleanup 이 수행
          }
          onKeyDown?.(e);
        }}
        className={cn(
          "absolute top-full z-50 mt-2 flex w-80 flex-col gap-3 rounded-radius border border-border/50 bg-popover p-4 shadow-overlay outline-none",
          align === "start" && "left-0",
          align === "center" && "left-1/2 -translate-x-1/2",
          align === "end" && "right-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PopoverContent.displayName = "PopoverContent";

/** Figma "Texts" 프레임(제목+설명, gap 4) */
const PopoverHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1", className)} {...props} />
);

const PopoverTitle = ({ className, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  const { titleId, setHasTitle } = usePopover();
  useRegisterPresence(setHasTitle);
  return (
    <h2
      id={id ?? titleId}
      className={cn("text-sm font-medium leading-5 text-foreground", className)}
      {...props}
    />
  );
};

const PopoverDescription = ({ className, id, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  const { descId, setHasDesc } = usePopover();
  useRegisterPresence(setHasDesc);
  return (
    <p
      id={id ?? descId}
      className={cn("text-sm leading-5 text-muted-foreground", className)}
      {...props}
    />
  );
};

export { Popover, PopoverTrigger, PopoverClose, PopoverContent, PopoverHeader, PopoverTitle, PopoverDescription };
