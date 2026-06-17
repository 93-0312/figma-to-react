import { Sheet, SheetContent, type SheetContentProps } from "./sheet";

/**
 * Drawer — Figma "BO UI Kit" Drawer(node 8046:330). 가장자리 패널(Sheet 기반, 여백 있는 inset 기본).
 *
 * Sheet 를 재사용한 프리셋: 기본 side=bottom + inset(플로팅 rounded-2xl). 제어/비제어(open).
 * 헤더/푸터는 Sheet 의 SheetHeader/SheetTitle/SheetDescription/SheetFooter 를 그대로 사용.
 */
export interface DrawerProps
  extends Omit<SheetContentProps, "side"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: SheetContentProps["side"];
}

function Drawer({ open, defaultOpen, onOpenChange, side = "bottom", inset = true, children, ...contentProps }: DrawerProps) {
  return (
    <Sheet open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <SheetContent side={side} inset={inset} {...contentProps}>
        {children}
      </SheetContent>
    </Sheet>
  );
}

export { Drawer };
export {
  SheetHeader as DrawerHeader,
  SheetTitle as DrawerTitle,
  SheetDescription as DrawerDescription,
  SheetFooter as DrawerFooter,
} from "./sheet";
