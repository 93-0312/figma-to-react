import { ComboBox } from "../components/ui/combobox";
import type {
  ComboBoxOption,
  ComboBoxOptionGroup,
} from "../components/ui/combobox";
import type { Story } from "../playground/types";

const GROUPED: (ComboBoxOption | ComboBoxOptionGroup)[] = [
  {
    label: "Fruits",
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "cherry", label: "Cherry" },
      { value: "durian", label: "Durian (품절)", disabled: true },
    ],
  },
  {
    label: "Vegetables",
    options: [
      { value: "carrot", label: "Carrot" },
      { value: "onion", label: "Onion" },
      { value: "spinach", label: "Spinach" },
    ],
  },
];

const FLAT: ComboBoxOption[] = [
  { value: "next", label: "Next.js" },
  { value: "vite", label: "Vite" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

export const comboboxStory: Story = {
  name: "ComboBox",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7758-403",
  controls: [
    { type: "select", name: "value", label: "value", options: ["", "apple", "banana", "cherry", "carrot", "onion", "spinach"], default: "banana" },
    { type: "select", name: "inputSize", label: "size", options: ["sm", "md", "lg"], default: "md" },
    { type: "boolean", name: "showInsideInput", label: "showInsideInput (검색)", default: true },
    { type: "boolean", name: "fadeBottom", label: "fadeBottom (Fader)", default: true },
    { type: "boolean", name: "invalid", label: "invalid (error)", default: false },
    { type: "boolean", name: "disabled", label: "disabled", default: false },
  ],
  render: (args, setArg) => (
    <div className="w-[286px]">
      <ComboBox
        options={GROUPED}
        placeholder="Select an item…"
        searchPlaceholder="e.g placeholder"
        inputSize={args.inputSize as "sm" | "md" | "lg"}
        showInsideInput={Boolean(args.showInsideInput)}
        fadeBottom={Boolean(args.fadeBottom)}
        invalid={Boolean(args.invalid)}
        disabled={Boolean(args.disabled)}
        value={String(args.value)}
        onValueChange={(v) => setArg("value", v)}
      />
    </div>
  ),
  gallery: <ComboBoxGallery />,
};

function ComboBoxGallery() {
  return (
    <div className="flex max-w-[300px] flex-col gap-4">
      {(
        [
          { label: "Grouped (검색 열어보기)", props: { options: GROUPED } },
          { label: "Flat + 선택값", props: { options: FLAT, defaultValue: "vite" } },
          {
            label: "검색 없이 (ShowInsideInput=false)",
            props: { options: FLAT, showInsideInput: false },
          },
          { label: "Invalid", props: { options: FLAT, invalid: true } },
          {
            label: "Disabled",
            props: { options: FLAT, disabled: true, defaultValue: "next" },
          },
        ] as const
      ).map((s) => (
        <label key={s.label} className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">{s.label}</span>
          <ComboBox placeholder="Select an item…" searchPlaceholder="e.g placeholder" {...s.props} />
        </label>
      ))}
      <label className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">
          Empty (검색어와 안 맞으면 &quot;No items found.&quot;)
        </span>
        <ComboBox
          options={[]}
          placeholder="Nothing to select…"
          searchPlaceholder="e.g placeholder"
        />
      </label>
      <div className="flex flex-col gap-3">
        <span className="text-xs text-muted-foreground">Sizes (sm / md / lg)</span>
        {(["sm", "md", "lg"] as const).map((sz) => (
          <ComboBox key={sz} options={FLAT} inputSize={sz} placeholder={sz} />
        ))}
      </div>
    </div>
  );
}
