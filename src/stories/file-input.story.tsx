import { FileInput } from "../components/ui/file-input";
import type { Story } from "../playground/types";

const SIZES = ["sm", "md", "lg"] as const;

export const fileInputStory: Story = {
  name: "File Input",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7751-45",
  controls: [
    { type: "select", name: "inputSize", label: "inputSize", options: [...SIZES], default: "md" },
    { type: "text", name: "chooseLabel", label: "chooseLabel", default: "Choose File" },
    { type: "text", name: "placeholder", label: "placeholder", default: "No file chosen" },
    { type: "boolean", name: "multiple", label: "multiple", default: false },
    { type: "boolean", name: "invalid", label: "invalid", default: false },
    { type: "boolean", name: "disabled", label: "disabled", default: false },
  ],
  render: (args) => (
    <div className="w-[280px]">
      <FileInput
        inputSize={args.inputSize as (typeof SIZES)[number]}
        chooseLabel={String(args.chooseLabel)}
        placeholder={String(args.placeholder)}
        multiple={Boolean(args.multiple)}
        invalid={Boolean(args.invalid)}
        disabled={Boolean(args.disabled)}
      />
    </div>
  ),
  gallery: (
    <div className="flex flex-col gap-8">
      {/* Figma Size 3종 (h28/32/36) */}
      <div className="flex max-w-[280px] flex-col gap-3">
        <span className="text-xs text-muted-foreground">Size — Small / Default / Large</span>
        {SIZES.map((s) => (
          <FileInput key={s} inputSize={s} aria-label={`file ${s}`} />
        ))}
      </div>

      {/* 상태 */}
      <div className="flex max-w-[280px] flex-col gap-3">
        <span className="text-xs text-muted-foreground">상태 — 기본 / invalid / disabled</span>
        <FileInput aria-label="file default" />
        <FileInput invalid aria-label="file invalid" />
        <FileInput disabled aria-label="file disabled" />
      </div>

      {/* 문구 커스터마이즈 + multiple */}
      <div className="flex max-w-[280px] flex-col gap-3">
        <span className="text-xs text-muted-foreground">문구 커스터마이즈 / multiple</span>
        <FileInput chooseLabel="파일 선택" placeholder="선택된 파일 없음" aria-label="file ko" />
        <FileInput multiple placeholder="No files chosen" aria-label="file multiple" />
      </div>
    </div>
  ),
};
