import { Avatar } from "../components/ui/avatar";
import { AvatarGroup } from "../components/ui/avatar-group";
import type { AvatarProps } from "../components/ui/avatar";
import type { Story } from "../playground/types";

const SIZES: NonNullable<AvatarProps["size"]>[] = ["xs", "sm", "md", "lg", "xl", "2xl"];
const PEOPLE = ["VL", "JH", "SK", "MK", "DH"];

export const avatarGroupStory: Story = {
  name: "Avatar Group",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=1696-220",
  controls: [
    { type: "select", name: "size", label: "size", options: SIZES, default: "xl" },
    { type: "text", name: "max", label: "max (빈칸=전체)", default: "" },
  ],
  render: (args) => {
    const max = args.max ? Number(args.max) : undefined;
    return (
      <AvatarGroup size={args.size as AvatarProps["size"]} max={Number.isFinite(max) ? max : undefined}>
        {PEOPLE.map((p) => (
          <Avatar key={p} fallback={p} />
        ))}
      </AvatarGroup>
    );
  },
  gallery: (
    <div className="flex flex-col gap-5">
      {(["sm", "md", "xl"] as const).map((sz) => (
        <div key={sz} className="flex items-center gap-4">
          <span className="w-16 text-xs text-muted-foreground">size {sz}</span>
          <AvatarGroup size={sz}>
            {PEOPLE.map((p) => (
              <Avatar key={p} fallback={p} />
            ))}
          </AvatarGroup>
          <AvatarGroup size={sz} max={3}>
            {PEOPLE.map((p) => (
              <Avatar key={p} fallback={p} />
            ))}
          </AvatarGroup>
        </div>
      ))}
    </div>
  ),
};
