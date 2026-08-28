import { Switch } from "../components/ui/switch";
import type { SwitchProps } from "../components/ui/switch";
import type { Story } from "../playground/types";

const SIZES: NonNullable<SwitchProps["size"]>[] = ["sm", "md", "lg"];

export const switchStory: Story = {
  name: "Switch",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7715-1962",
  controls: [
    { type: "select", name: "size", label: "size", options: SIZES, default: "md" },
    { type: "boolean", name: "checked", label: "checked", default: false },
    { type: "boolean", name: "disabled", label: "disabled", default: false },
  ],
  render: (args, setArg) => (
    <Switch
      size={args.size as SwitchProps["size"]}
      checked={Boolean(args.checked)}
      onCheckedChange={(v) => setArg("checked", v)}
      disabled={Boolean(args.disabled)}
    />
  ),
  gallery: (
    <div className="flex flex-col gap-4">
      {SIZES.map((sz) => (
        <div key={sz} className="flex items-center gap-3">
          <span className="w-16 text-xs text-muted-foreground">size {sz}</span>
          <Switch size={sz} />
          <Switch size={sz} defaultChecked />
          <Switch size={sz} defaultChecked disabled />
          <Switch size={sz} disabled />
        </div>
      ))}
    </div>
  ),
};
