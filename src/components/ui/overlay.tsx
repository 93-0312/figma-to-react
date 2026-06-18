import * as React from "react";
import { createPortal } from "react-dom";

/**
 * 오버레이 공용 내부 유틸 — Dialog / AlertDialog / Sheet / Drawer 가 공유.
 * 포털(body), ESC 닫기 + body 스크롤 잠금, 백드롭(black@32% + blur).
 */
export function Portal({ children }: { children: React.ReactNode }) {
  // 클라이언트면 즉시 body 로 포털(한 틱 지연 없음 → 패널 ref 가 같은 커밋에 붙어
  // 포커스 트랩이 컨테이너를 바로 잡는다). 서버(SSR)면 document 가 없어 null.
  const [container] = React.useState<HTMLElement | null>(() =>
    typeof document !== "undefined" ? document.body : null
  );
  return container ? createPortal(children, container) : null;
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

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * 열림 시 포커스를 패널로 옮기고 Tab/Shift+Tab 을 패널 안에 가둔다. 닫히면 이전
 * 포커스로 복원. 초기 포커스는 내부 요소가 아니라 패널 자체(tabIndex=-1)로 둬서
 * 포커스 링이 생겨 시각이 바뀌는 것을 막는다(패널엔 outline-none).
 */
export function useFocusTrap(
  open: boolean,
  containerRef: React.RefObject<HTMLElement | null>
) {
  React.useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;
    const prevFocused = document.activeElement as HTMLElement | null;
    const items = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );

    // 포커스 이동은 매크로태스크로 미룬다 — 등장 직후의 동기 리렌더(제목/설명 등록)와
    // dev StrictMode 의 이중 마운트가 focus() 를 덮어쓰는 것을 피한다. rAF 대신 setTimeout
    // 을 쓰는 이유: 탭이 백그라운드(hidden)면 rAF 는 멈추지만 setTimeout 은 동작한다.
    // 이미 패널 안에 포커스가 있으면(사용자 클릭 등) 건드리지 않는다.
    const timer = setTimeout(() => {
      const c = containerRef.current;
      if (c && !c.contains(document.activeElement)) c.focus();
    }, 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const list = items();
      if (list.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === container)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    container.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      container.removeEventListener("keydown", onKey);
      // 닫힐 때 트리거로 포커스 복원. cleanup 시점엔 패널이 이미 DOM 에서 빠져 있을 수
      // 있으므로 패널 contains 검사 대신, 복원 대상이 아직 문서에 있는지(isConnected)만 본다.
      if (prevFocused?.isConnected) prevFocused.focus();
    };
  }, [open, containerRef]);
}

/**
 * Title/Description 존재 여부를 추적해 컨테이너에 붙일 aria-labelledby/describedby 를
 * 만든다. 제목/설명이 실제로 렌더된 경우에만 연결(없는 id 참조 방지).
 */
export function useA11yIds() {
  const titleId = React.useId();
  const descId = React.useId();
  const [hasTitle, setHasTitle] = React.useState(false);
  const [hasDesc, setHasDesc] = React.useState(false);
  return {
    titleId,
    descId,
    setHasTitle,
    setHasDesc,
    labelProps: {
      "aria-labelledby": hasTitle ? titleId : undefined,
      "aria-describedby": hasDesc ? descId : undefined,
    } as { "aria-labelledby"?: string; "aria-describedby"?: string },
  };
}

/** Title/Description 컴포넌트가 마운트 동안 자신의 존재를 등록한다. */
export function useRegisterPresence(setPresent: (v: boolean) => void) {
  React.useEffect(() => {
    setPresent(true);
    return () => setPresent(false);
  }, [setPresent]);
}
