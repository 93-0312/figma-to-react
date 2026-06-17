import { NumberField } from "../components/ui/number-field";
import type { NumberFieldProps } from "../components/ui/number-field";
import type { Story } from "../playground/types";

const SIZES: NonNullable<NumberFieldProps["size"]>[] = ["sm", "md", "lg"];

export const numberFieldStory: Story = {
  name: "Number Field",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7781-5501",
  controls: [
    { type: "select", name: "size", label: "size", options: SIZES, default: "md" },
    { type: "boolean", name: "disabled", label: "disabled", default: false },
  ],
  render: (args, setArg) => (
    <div className="w-[200px]">
      <NumberField
        size={args.size as NumberFieldProps["size"]}
        disabled={Boolean(args.disabled)}
        min={0}
        max={10}
        value={Number(args.value ?? 3)}
        onValueChange={(v) => setArg("value", String(v))}
      />
    </div>
  ),
  gallery: (
    <div className="flex flex-col gap-3">
      {SIZES.map((sz) => (
        <div key={sz} className="flex items-center gap-3">
          <span className="w-12 text-xs text-muted-foreground">{sz}</span>
          <div className="w-[200px]">
            <NumberField size={sz} defaultValue={3} min={0} max={10} />
          </div>
        </div>
      ))}
    </div>
  ),
};
