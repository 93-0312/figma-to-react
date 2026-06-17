import * as React from "react";
import { createPortal } from "react-dom";

/**
 * 오버레이 공용 내부 유틸 — Dialog / AlertDialog / Sheet / Drawer 가 공유.
 * 포털(body), ESC 닫기 + body 스크롤 잠금, 백드롭(black@32% + blur).
 */
export function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}

/** 열림 동안 ESC 로 닫고 body 스크롤을 잠근다. */
export function useOverlayBehavior(open: boolean, onClose: () => void) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
}

/** 백드롭(검정 #101012 @32% + 배경 블러). Figma Overlay 토큰. */
export const backdropClass =
  "fixed inset-0 z-50 bg-[rgb(16_16_18_/_0.32)] backdrop-blur-sm";

/** open/defaultOpen/onOpenChange 를 controlled/uncontrolled 로 다루는 훅. */
export function useControllableOpen(
  open: boolean | undefined,
  defaultOpen: boolean,
  onOpenChange?: (o: boolean) => void
) {
  const isControlled = open !== undefined;
  const [internal, setInternal] = React.useState(defaultOpen);
  const value = isControlled ? open : internal;
  const setValue = React.useCallback(
    (o: boolean) => {
      if (!isControlled) setInternal(o);
      onOpenChange?.(o);
    },
    [isControlled, onOpenChange]
  );
  return [value, setValue] as const;
}
