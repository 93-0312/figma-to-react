import { Avatar } from "../components/ui/avatar";
import type { AvatarProps } from "../components/ui/avatar";
import type { Story } from "../playground/types";

const SIZES: NonNullable<AvatarProps["size"]>[] = ["xs", "sm", "md", "lg", "xl", "2xl"];

export const avatarStory: Story = {
  name: "Avatar",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=1696-153",
  controls: [
    { type: "select", name: "size", label: "size", options: SIZES, default: "xl" },
    { type: "select", name: "shape", label: "shape", options: ["circle", "square"], default: "circle" },
    { type: "text", name: "fallback", label: "fallback(이니셜)", default: "VL" },
  ],
  render: (args) => (
    <Avatar
      size={args.size as AvatarProps["size"]}
      shape={args.shape as AvatarProps["shape"]}
      fallback={String(args.fallback)}
    />
  ),
  gallery: (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="w-16 text-xs text-muted-foreground">circle</span>
        {SIZES.map((sz) => (
          <Avatar key={sz} size={sz} fallback="VL" />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="w-16 text-xs text-muted-foreground">square</span>
        {SIZES.map((sz) => (
          <Avatar key={sz} size={sz} shape="square" fallback="VL" />
        ))}
      </div>
    </div>
  ),
};
