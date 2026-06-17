import { Button } from "../components/ui/button";
import type { ButtonProps } from "../components/ui/button";
import type { Story } from "../playground/types";
import { ChevronIcon, PlusIcon } from "./icons";

const VARIANTS: NonNullable<ButtonProps["variant"]>[] = [
  "default",
  "outline",
  "secondary",
  "destructive",
  "destructive-outline",
  "ghost",
  "link",
];

const SIZES: NonNullable<ButtonProps["size"]>[] = ["xs", "sm", "md", "lg", "xl"];

export const buttonStory: Story = {
  name: "Button",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=1692-74",
  controls: [
    { type: "select", name: "variant", label: "variant", options: VARIANTS, default: "default" },
    { type: "select", name: "size", label: "size", options: SIZES, default: "md" },
    { type: "text", name: "children", label: "label", default: "Label" },
    { type: "boolean", name: "disabled", label: "disabled", default: false },
    { type: "boolean", name: "icon", label: "left icon", default: false },
    { type: "boolean", name: "rightIcon", label: "right icon", default: false },
    { type: "boolean", name: "pill", label: "pill (rounded-full)", default: false },
  ],
  render: (args) => (
    <Button
      variant={args.variant as ButtonProps["variant"]}
      size={args.size as ButtonProps["size"]}
      disabled={Boolean(args.disabled)}
      pill={Boolean(args.pill)}
      icon={args.icon ? <PlusIcon /> : undefined}
      rightIcon={args.rightIcon ? <ChevronIcon /> : undefined}
    >
      {String(args.children) || undefined}
    </Button>
  ),
  gallery: (
    <div className="space-y-4">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-3">
          <span className="w-40 shrink-0 text-sm text-muted-foreground">{variant}</span>
          {SIZES.map((size) => (
            <Button key={size} variant={variant} size={size}>
              Label
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};
