import { Autocomplete } from "../components/ui/autocomplete";
import type { Story } from "../playground/types";

const FRUITS = [
  "Apple",
  "Apricot",
  "Banana",
  "Blueberry",
  "Cherry",
  "Grape",
  "Mango",
  "Orange",
  "Peach",
  "Strawberry",
];

export const autocompleteStory: Story = {
  name: "Autocomplete",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7757-187",
  controls: [
    { type: "text", name: "value", label: "value (입력 텍스트)", default: "" },
    { type: "select", name: "inputSize", label: "size", options: ["sm", "md", "lg"], default: "md" },
    { type: "boolean", name: "fadeOnBottom", label: "fadeOnBottom (Figma FadeOnBot)", default: false },
    { type: "boolean", name: "invalid", label: "invalid (error)", default: false },
    { type: "boolean", name: "disabled", label: "disabled", default: false },
  ],
  render: (args, setArg) => (
    <div className="w-[286px]">
      <Autocomplete
        options={FRUITS}
        placeholder="Type to search fruits…"
        inputSize={args.inputSize as "sm" | "md" | "lg"}
        fadeOnBottom={Boolean(args.fadeOnBottom)}
        invalid={Boolean(args.invalid)}
        disabled={Boolean(args.disabled)}
        value={String(args.value)}
        onValueChange={(v) => setArg("value", v)}
      />
    </div>
  ),
  gallery: <AutocompleteGallery />,
};

function AutocompleteGallery() {
  return (
    <div className="flex max-w-[300px] flex-col gap-4">
      {(
        [
          { label: "Default (포커스하면 전체 제안)", props: {} },
          { label: "FadeOnBot=True", props: { fadeOnBottom: true } },
          {
            label: "Empty (일치 없음 → \"No items found.\")",
            props: { options: [] as string[] },
          },
          { label: "Invalid", props: { invalid: true } },
          { label: "Disabled", props: { disabled: true, defaultValue: "Apple" } },
        ] as const
      ).map((s) => (
        <label key={s.label} className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">{s.label}</span>
          <Autocomplete
            options={FRUITS}
            placeholder="Type to search…"
            {...s.props}
          />
        </label>
      ))}
      <div className="flex flex-col gap-3">
        <span className="text-xs text-muted-foreground">Sizes (sm / md / lg)</span>
        {(["sm", "md", "lg"] as const).map((sz) => (
          <Autocomplete
            key={sz}
            options={FRUITS}
            inputSize={sz}
            placeholder={sz}
          />
        ))}
      </div>
    </div>
  );
}
