import { Textarea } from "../components/ui/textarea";
import type { TextareaProps } from "../components/ui/textarea";
import type { Story } from "../playground/types";

const SIZES: NonNullable<TextareaProps["inputSize"]>[] = ["sm", "md", "lg"];

export const textareaStory: Story = {
  name: "Textarea",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7751-1067",
  controls: [
    { type: "select", name: "inputSize", label: "size", options: SIZES, default: "md" },
    { type: "text", name: "placeholder", label: "placeholder", default: "내용을 입력하세요" },
    { type: "boolean", name: "invalid", label: "invalid (error)", default: false },
    { type: "boolean", name: "disabled", label: "disabled", default: false },
  ],
  render: (args) => (
    <div className="w-[260px]">
      <Textarea
        inputSize={args.inputSize as TextareaProps["inputSize"]}
        placeholder={String(args.placeholder)}
        invalid={Boolean(args.invalid)}
        disabled={Boolean(args.disabled)}
      />
    </div>
  ),
  gallery: (
    <div className="flex max-w-[280px] flex-col gap-4">
      {([
        { label: "Default", props: {} },
        { label: "Invalid", props: { invalid: true } },
        { label: "Disabled", props: { disabled: true } },
      ] as const).map((s) => (
        <label key={s.label} className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">{s.label}</span>
          <Textarea placeholder="내용을 입력하세요" {...s.props} />
        </label>
      ))}
    </div>
  ),
};
