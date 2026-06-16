import { Select } from "../components/ui/select";
import type { SelectProps, SelectOption } from "../components/ui/select";
import type { Story } from "../playground/types";

const SIZES: NonNullable<SelectProps["inputSize"]>[] = ["sm", "md", "lg"];

const OPTIONS: SelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "durian", label: "Durian (품절)", disabled: true },
  { value: "elderberry", label: "Elderberry" },
];

export const selectStory: Story = {
  name: "Select",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7751-1561",
  controls: [
    { type: "select", name: "inputSize", label: "size", options: SIZES, default: "md" },
    { type: "text", name: "placeholder", label: "placeholder", default: "Select a fruit…" },
    { type: "boolean", name: "invalid", label: "invalid (error)", default: false },
    { type: "boolean", name: "disabled", label: "disabled", default: false },
  ],
  render: (args) => (
    <div className="w-[260px]">
      <Select
        options={OPTIONS}
        inputSize={args.inputSize as SelectProps["inputSize"]}
        placeholder={String(args.placeholder)}
        invalid={Boolean(args.invalid)}
        disabled={Boolean(args.disabled)}
        defaultValue="banana"
      />
    </div>
  ),
  gallery: <SelectGallery />,
};

function SelectGallery() {
  return (
    <div className="flex max-w-[280px] flex-col gap-4">
      {([
        { label: "Default", props: {} },
        { label: "With value", props: { defaultValue: "cherry" } },
        { label: "Invalid", props: { invalid: true } },
        { label: "Disabled", props: { disabled: true, defaultValue: "apple" } },
      ] as const).map((s) => (
        <label key={s.label} className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">{s.label}</span>
          <Select options={OPTIONS} placeholder="Select a fruit…" {...s.props} />
        </label>
      ))}
      <div className="flex flex-col gap-3">
        <span className="text-xs text-muted-foreground">Sizes (sm / md / lg)</span>
        {SIZES.map((sz) => (
          <Select key={sz} options={OPTIONS} inputSize={sz} placeholder={sz} />
        ))}
      </div>
    </div>
  );
}
