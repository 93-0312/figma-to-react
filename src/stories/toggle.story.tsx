import { Toggle } from "../components/ui/toggle";
import type { ToggleProps } from "../components/ui/toggle";
import type { Story } from "../playground/types";
import { PlusIcon } from "./icons";

const VARIANTS: NonNullable<ToggleProps["variant"]>[] = ["default", "outline"];
const SIZES: NonNullable<ToggleProps["size"]>[] = ["sm", "md", "lg"];

export const toggleStory: Story = {
  name: "Toggle",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=5685-204",
  controls: [
    { type: "select", name: "variant", label: "variant", options: VARIANTS, default: "default" },
    { type: "select", name: "size", label: "size", options: SIZES, default: "md" },
    { type: "boolean", name: "iconOnly", label: "icon only", default: false },
    { type: "boolean", name: "defaultPressed", label: "pressed", default: false },
    { type: "boolean", name: "disabled", label: "disabled", default: false },
    { type: "text", name: "label", label: "label", default: "Label" },
  ],
  render: (args) => (
    <Toggle
      variant={args.variant as ToggleProps["variant"]}
      size={args.size as ToggleProps["size"]}
      iconOnly={Boolean(args.iconOnly)}
      defaultPressed={Boolean(args.defaultPressed)}
      disabled={Boolean(args.disabled)}
    >
      {args.iconOnly ? <PlusIcon /> : String(args.label)}
    </Toggle>
  ),
  gallery: <ToggleGallery />,
};

function ToggleGallery() {
  return (
    <div className="flex flex-col gap-6">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-3">
          <span className="text-xs text-muted-foreground">
            variant: {variant}
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {([
              { label: "Default", props: {} },
              { label: "Pressed", props: { defaultPressed: true } },
              { label: "Disabled", props: { disabled: true } },
            ] as const).map((s) => (
              <Toggle key={s.label} variant={variant} {...s.props}>
                {s.label}
              </Toggle>
            ))}
            {SIZES.map((sz) => (
              <Toggle key={sz} variant={variant} size={sz} iconOnly>
                <PlusIcon />
              </Toggle>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
