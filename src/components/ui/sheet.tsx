import * as React from "react";
import { cn } from "../../lib/utils";
import {
  Portal,
  backdropClass,
  useOverlayBehavior,
  useControllableOpen,
  useFocusTrap,
  useA11yIds,
  useRegisterPresence,
} from "./overlay";

/**
 * Sheet — Figma "BO UI Kit" Sheet(node 7669:1795). 화면 가장자리에서 나오는 플라이아웃(dialog 기반).
 *
 * 합성: Sheet > SheetTrigger? + SheetContent(side) > SheetHeader/Title/Description + 본문 + SheetFooter.
 * side left/right/top/bottom. inset=true 면 여백 있는 플로팅(rounded-2xl), false 면 가장자리에 붙음.
 * 패널 bg-popover+border+shadow-popover. 백드롭 black@32%+blur. ESC/바깥클릭/X 닫기, 스크롤 잠금.
 */
interface SheetCtx {
  open: boolean;
  setOpen: (o: boolean) => void;
  titleId: string;
  descId: string;
  setHasTitle: (v: boolean) => void;
  setHasDesc: (v: boolean) => void;
  labelProps: { "aria-labelledby"?: string; "aria-describedby"?: string };
}
const Ctx = React.createContext<SheetCtx | null>(null);
const useSheet = () => {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("Sheet parts must be used within <Sheet>");
  return c;
};

export interface SheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}
function Sheet({ open, defaultOpen = false, onOpenChange, children }: SheetProps) {
  const [value, setValue] = useControllableOpen(open, defaultOpen, onOpenChange);
  const a11y = useA11yIds();
  return <Ctx.Provider value={{ open: value, setOpen: setValue, ...a11y }}>{children}</Ctx.Provider>;
}

const SheetTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ onClick, ...props }, ref) => {
    const { setOpen } = useSheet();
    return <button ref={ref} type="button" onClick={(e) => { setOpen(true); onClick?.(e); }} {...props} />;
  }
);
SheetTrigger.displayName = "SheetTrigger";

const SheetClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ onClick, ...props }, ref) => {
    const { setOpen } = useSheet();
    return <button ref={ref} type="button" onClick={(e) => { setOpen(false); onClick?.(e); }} {...props} />;
  }
);
SheetClose.displayName = "SheetClose";

type Side = "left" | "right" | "top" | "bottom";
const flush: Record<Side, string> = {
  right: "inset-y-0 right-0 h-full w-full max-w-sm border-l rounded-l-radius-2xl",
  left: "inset-y-0 left-0 h-full w-full max-w-sm border-r rounded-r-radius-2xl",
  top: "inset-x-0 top-0 w-full border-b rounded-b-radius-2xl",
  bottom: "inset-x-0 bottom-0 w-full border-t rounded-t-radius-2xl",
};
const insetPos: Record<Side, string> = {
  right: "inset-y-4 right-4 w-full max-w-sm",
  left: "inset-y-4 left-4 w-full max-w-sm",
  top: "inset-x-4 top-4",
  bottom: "inset-x-4 bottom-4",
};

export interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: Side;
  /** 여백 있는 플로팅 패널(rounded-2xl) */
  inset?: boolean;
  showClose?: boolean;
}
const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, side = "right", inset = false, showClose = true, children, ...props }, ref) => {
    const { open, setOpen, labelProps } = useSheet();
    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const mergeRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        panelRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );
    useOverlayBehavior(open, () => setOpen(false));
    useFocusTrap(open, panelRef);
    if (!open) return null;
    return (
      <Portal>
        <div className={backdropClass} onClick={() => setOpen(false)}>
          <div
            ref={mergeRef}
            role="dialog"
            aria-modal
            tabIndex={-1}
            {...labelProps}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "fixed flex flex-col overflow-auto border-border bg-popover shadow-popover outline-none",
              inset ? cn(insetPos[side], "rounded-radius-2xl border") : flush[side],
              className
            )}
            {...props}
          >
            {showClose && (
              <button
                type="button"
                aria-label="닫기"
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 inline-flex size-6 items-center justify-center rounded-radius text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden>
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            )}
            {children}
          </div>
        </div>
      </Portal>
    );
  }
);
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1 p-6", className)} {...props} />
);
const SheetTitle = ({ className, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  const { titleId, setHasTitle } = useSheet();
  useRegisterPresence(setHasTitle);
  return (
    <h2
      id={id ?? titleId}
      className={cn("text-xl font-semibold leading-7 tracking-[-0.2px] text-foreground", className)}
      {...props}
    />
  );
};
const SheetDescription = ({ className, id, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  const { descId, setHasDesc } = useSheet();
  useRegisterPresence(setHasDesc);
  return <p id={id ?? descId} className={cn("text-sm leading-5 text-muted-foreground", className)} {...props} />;
};
const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex items-center justify-end gap-2 border-t border-border px-6 py-4", className)} {...props} />
);

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose };
