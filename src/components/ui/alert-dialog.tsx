import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { useControllableOpen } from "./overlay";

/**
 * AlertDialog — Figma "BO UI Kit" AlertDialog(node 5655:5142). 확인이 필요한 모달.
 *
 * Dialog 프리미티브 재사용 + role=alertdialog + 바깥클릭/X 비활성(명시적 선택 필요).
 * 취소/실행 버튼. `destructive` 시 실행 버튼이 빨간(destructive) Button. 제어/비제어(open).
 */
export interface AlertDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  cancelText?: React.ReactNode;
  actionText?: React.ReactNode;
  onAction?: () => void;
  onCancel?: () => void;
  destructive?: boolean;
  children?: React.ReactNode;
}

function AlertDialog({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
  cancelText = "취소",
  actionText = "확인",
  onAction,
  onCancel,
  destructive,
  children,
}: AlertDialogProps) {
  const [o, setO] = useControllableOpen(open, defaultOpen, onOpenChange);
  return (
    <Dialog open={o} onOpenChange={setO} role="alertdialog" dismissable={false}>
      <DialogContent showClose={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description != null && <DialogDescription>{description}</DialogDescription>}
          {children}
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => { onCancel?.(); setO(false); }}>
            {cancelText}
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={() => { onAction?.(); setO(false); }}
          >
            {actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { AlertDialog };
