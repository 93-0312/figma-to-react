import { Input } from "../components/ui/input";
import type { InputProps } from "../components/ui/input";
import type { Story } from "../playground/types";
import { PlusIcon } from "./icons";

const SIZES: NonNullable<InputProps["inputSize"]>[] = ["sm", "md", "lg"];

export const inputStory: Story = {
  name: "Input",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7745-699",
  controls: [
    { type: "select", name: "inputSize", label: "size", options: SIZES, default: "md" },
    { type: "text", name: "placeholder", label: "placeholder", default: "Label" },
    { type: "boolean", name: "invalid", label: "invalid (error)", default: false },
    { type: "boolean", name: "disabled", label: "disabled", default: false },
    { type: "boolean", name: "leftIcon", label: "left icon", default: false },
    { type: "text", name: "prefix", label: "prefix", default: "" },
    { type: "text", name: "suffix", label: "suffix", default: "" },
  ],
  render: (args) => (
    <div className="w-[260px]">
      <Input
        inputSize={args.inputSize as InputProps["inputSize"]}
        placeholder={String(args.placeholder)}
        invalid={Boolean(args.invalid)}
        disabled={Boolean(args.disabled)}
        leftIcon={args.leftIcon ? <PlusIcon /> : undefined}
        prefix={args.prefix ? String(args.prefix) : undefined}
        suffix={args.suffix ? String(args.suffix) : undefined}
      />
    </div>
  ),
  gallery: <InputGallery />,
};

function InputGallery() {
  return (
    <div className="flex max-w-[280px] flex-col gap-4">
      {([
        { label: "Default", props: {} },
        { label: "Invalid", props: { invalid: true } },
        { label: "Disabled", props: { disabled: true } },
        { label: "With prefix/suffix", props: { prefix: "https://", suffix: ".com" } },
        { label: "With left icon", props: { leftIcon: <PlusIcon /> } },
      ] as const).map((s) => (
        <label key={s.label} className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">{s.label}</span>
          <Input placeholder="Label" {...s.props} />
        </label>
      ))}
      <div className="flex flex-col gap-3">
        <span className="text-xs text-muted-foreground">Sizes (sm / md / lg)</span>
        {SIZES.map((sz) => (
          <Input key={sz} inputSize={sz} placeholder={sz} />
        ))}
      </div>
    </div>
  );
}
