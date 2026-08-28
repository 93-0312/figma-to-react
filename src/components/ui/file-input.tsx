import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { inputVariants } from "./input";

/**
 * FileInput — Figma "BO UI Kit" Input 세트의 `Type=File` 변형(node 7751:45).
 *
 * 구조(Figma): [Choose File 텍스트] [선택 파일명 / "No file chosen"] [우측 chevron]
 *  - ChooseFileFrame: 좌우 padding 6(px-1.5), 텍스트 `foreground` — **버튼 배경/테두리 없음**
 *  - 파일명 라벨: 미선택 시 "No file chosen", `tertiary-foreground`(#8d95a2)
 *  - RightIcon: 16px chevron, `foreground`
 * 컨테이너는 Input 과 동일한 `inputVariants` 재사용(테두리·포커스링·사이즈 h28/32/36).
 *
 * 접근성: 네이티브 `<input type="file">` 을 시각적으로만 숨기고 `<label>` 로 감싼다
 * (클릭·키보드 포커스·스크린리더가 전부 네이티브 동작을 그대로 따른다).
 * `sr-only` 대신 `absolute inset-0 opacity-0` 를 쓰지 않은 이유: 포커스 링을
 * 컨테이너의 `focus-within` 이 담당하게 하려면 input 이 실제 포커스를 받아야 한다.
 *
 * 상태 진리표
 * | files            | 표시                       |
 * |------------------|----------------------------|
 * | 없음             | "No file chosen" (tertiary) |
 * | 1개              | 파일명 (foreground)         |
 * | N개 (multiple)   | "N files selected"          |
 */
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export interface FileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "value">,
    Pick<VariantProps<typeof inputVariants>, "inputSize"> {
  /** 에러 상태(빨간 테두리) */
  invalid?: boolean;
  /** 좌측 "파일 선택" 문구 (Figma 기본: "Choose File") */
  chooseLabel?: React.ReactNode;
  /** 미선택 시 문구 (Figma 기본: "No file chosen") */
  placeholder?: string;
  /** 선택된 파일 표시 문자열을 직접 만들고 싶을 때 */
  formatFiles?: (files: File[]) => string;
  /** 선택 변경 콜백 (네이티브 onChange 와 별개로 File[] 을 준다) */
  onFilesChange?: (files: File[]) => void;
  /** 컨테이너 클래스(테두리/배경 등) */
  containerClassName?: string;
}

const defaultFormatFiles = (files: File[]) =>
  files.length === 1 ? files[0].name : `${files.length} files selected`;

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      className,
      containerClassName,
      inputSize,
      invalid = false,
      chooseLabel = "Choose File",
      placeholder = "No file chosen",
      formatFiles = defaultFormatFiles,
      onFilesChange,
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const [files, setFiles] = React.useState<File[]>([]);

    return (
      <label
        className={cn(
          inputVariants({ inputSize, invalid }),
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          containerClassName
        )}
        data-node-id="7751:45"
      >
        <input
          ref={ref}
          type="file"
          disabled={disabled}
          // 시각적으로만 숨긴다 — 포커스는 실제로 받아야 컨테이너 focus-within 이 동작한다
          className={cn("sr-only", className)}
          onChange={(e) => {
            const next = Array.from(e.target.files ?? []);
            setFiles(next);
            onFilesChange?.(next);
            onChange?.(e);
          }}
          {...props}
        />
        {/* ChooseFileFrame — 배경/테두리 없이 좌우 padding 6 (Figma 값) */}
        <span className="shrink-0 px-1.5 text-foreground">{chooseLabel}</span>
        <span
          className={cn(
            "min-w-0 flex-1 truncate px-1",
            files.length ? "text-foreground" : "text-tertiary-foreground"
          )}
        >
          {files.length ? formatFiles(files) : placeholder}
        </span>
        <ChevronDown className="size-4 shrink-0 text-foreground" />
      </label>
    );
  }
);
FileInput.displayName = "FileInput";

export { FileInput };
