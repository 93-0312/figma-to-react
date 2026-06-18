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
 * Dialog — Figma "BO UI Kit" Dialog(node 7656:1889). 페이지 위에 뜨는 모달.
 *
 * 합성: Dialog > DialogTrigger? + DialogContent > DialogHeader(DialogTitle/Description) + 본문 + DialogFooter.
 * 패널 bg-popover+border+rounded-2xl+shadow-popover. 백드롭 black@32%+blur. ESC/바깥클릭/X 로 닫기, 스크롤 잠금.
 * Footer 는 bg-secondary@72%+border-t(Figma BareFooter=False). 제어/비제어(open/onOpenChange).
 */
interface DialogCtx {
  open: boolean;
  setOpen: (o: boolean) => void;
  role: "dialog" | "alertdialog";
  dismissable: boolean;
  titleId: string;
  descId: string;
  setHasTitle: (v: boolean) => void;
  setHasDesc: (v: boolean) => void;
  labelProps: { "aria-labelledby"?: string; "aria-describedby"?: string };
}
const Ctx = React.createContext<DialogCtx | null>(null);
const useDialog = () => {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("Dialog parts must be used within <Dialog>");
  return c;
};

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 내부용: alertdialog 역할 + 바깥클릭 비활성 */
  role?: "dialog" | "alertdialog";
  dismissable?: boolean;
  children?: React.ReactNode;
}

function Dialog({ open, defaultOpen = false, onOpenChange, role = "dialog", dismissable = true, children }: DialogProps) {
  const [value, setValue] = useControllableOpen(open, defaultOpen, onOpenChange);
  const a11y = useA11yIds();
  return (
    <Ctx.Provider value={{ open: value, setOpen: setValue, role, dismissable, ...a11y }}>
      {children}
    </Ctx.Provider>
  );
}

const DialogTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ onClick, ...props }, ref) => {
    const { setOpen } = useDialog();
    return <button ref={ref} type="button" onClick={(e) => { setOpen(true); onClick?.(e); }} {...props} />;
  }
);
DialogTrigger.displayName = "DialogTrigger";

const DialogClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ onClick, ...props }, ref) => {
    const { setOpen } = useDialog();
    return <button ref={ref} type="button" onClick={(e) => { setOpen(false); onClick?.(e); }} {...props} />;
  }
);
DialogClose.displayName = "DialogClose";

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  showClose?: boolean;
}
const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, showClose = true, children, ...props }, ref) => {
    const { open, setOpen, role, dismissable, labelProps } = useDialog();
    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const mergeRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        panelRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );
    useOverlayBehavior(open, () => dismissable && setOpen(false));
    useFocusTrap(open, panelRef);
    if (!open) return null;
    return (
      <Portal>
        <div
          className={cn(backdropClass, "flex items-center justify-center p-4")}
          onClick={() => dismissable && setOpen(false)}
        >
          <div
            ref={mergeRef}
            role={role}
            aria-modal
            tabIndex={-1}
            {...labelProps}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative flex w-full max-w-[448px] flex-col overflow-hidden rounded-radius-2xl border border-border bg-popover shadow-popover outline-none",
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
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1 p-6", className)} {...props} />
);
const DialogTitle = ({ className, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  const { titleId, setHasTitle } = useDialog();
  useRegisterPresence(setHasTitle);
  return (
    <h2
      id={id ?? titleId}
      className={cn("text-xl font-semibold leading-7 tracking-[-0.2px] text-foreground", className)}
      {...props}
    />
  );
};
const DialogDescription = ({ className, id, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  const { descId, setHasDesc } = useDialog();
  useRegisterPresence(setHasDesc);
  return <p id={id ?? descId} className={cn("text-sm leading-5 text-muted-foreground", className)} {...props} />;
};
const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center justify-end gap-2 border-t border-border bg-secondary/[0.72] px-6 py-4", className)}
    {...props}
  />
);

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose };
