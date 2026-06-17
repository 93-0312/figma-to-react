import { Badge } from "../components/ui/badge";
import type { BadgeProps } from "../components/ui/badge";
import type { Story } from "../playground/types";

const COLORS: NonNullable<BadgeProps["color"]>[] = ["info", "success", "warning", "destructive", "neutral"];
const VARIANTS: NonNullable<BadgeProps["variant"]>[] = ["fill", "tinted"];

export const badgeStory: Story = {
  name: "Badge",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=9929-48567",
  controls: [
    { type: "select", name: "color", label: "color", options: COLORS, default: "info" },
    { type: "select", name: "variant", label: "variant", options: VARIANTS, default: "fill" },
    { type: "text", name: "label", label: "label", default: "Badge" },
  ],
  render: (args) => (
    <Badge color={args.color as BadgeProps["color"]} variant={args.variant as BadgeProps["variant"]}>
      {String(args.label)}
    </Badge>
  ),
  gallery: (
    <div className="flex flex-col gap-3">
      {VARIANTS.map((v) => (
        <div key={v} className="flex items-center gap-2">
          <span className="w-14 text-xs text-muted-foreground">{v}</span>
          {COLORS.map((c) => (
            <Badge key={c} color={c} variant={v}>
              {c}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};
