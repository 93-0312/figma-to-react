import * as React from "react";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import type { ToggleGroupProps } from "../components/ui/toggle-group";
import type { Story } from "../playground/types";

const VARIANTS: NonNullable<ToggleGroupProps["variant"]>[] = [
  "outline",
  "default",
];
const SIZES: NonNullable<ToggleGroupProps["size"]>[] = ["sm", "md", "lg"];
const ITEMS = ["Left", "Center", "Right"];

export const toggleGroupStory: Story = {
  name: "Toggle Group",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=5686-270",
  controls: [
    { type: "select", name: "type", label: "type", options: ["single", "multiple"], default: "single" },
    { type: "text", name: "value", label: "value (콤마구분)", default: "Left" },
    { type: "select", name: "variant", label: "variant", options: VARIANTS, default: "outline" },
    { type: "select", name: "size", label: "size", options: SIZES, default: "md" },
    { type: "select", name: "orientation", label: "orientation", options: ["horizontal", "vertical"], default: "horizontal" },
  ],
  render: (args, setArg) => {
    const type = args.type as "single" | "multiple";
    const vals = String(args.value)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const shared = {
      variant: args.variant as ToggleGroupProps["variant"],
      size: args.size as ToggleGroupProps["size"],
      orientation: args.orientation as "horizontal" | "vertical",
    };
    const items = ITEMS.map((v) => (
      <ToggleGroupItem key={v} value={v}>
        {v}
      </ToggleGroupItem>
    ));
    // single 은 string, multiple 은 string[] — 컨트롤엔 콤마구분 문자열로 보관해 양방향 동기화.
    return type === "multiple" ? (
      <ToggleGroup
        key="multiple"
        type="multiple"
        value={vals}
        onValueChange={(v) => setArg("value", v.join(","))}
        {...shared}
      >
        {items}
      </ToggleGroup>
    ) : (
      <ToggleGroup
        key="single"
        type="single"
        value={vals[0] ?? ""}
        onValueChange={(v) => setArg("value", v)}
        {...shared}
      >
        {items}
      </ToggleGroup>
    );
  },
  gallery: <ToggleGroupGallery />,
};

function ToggleGroupGallery() {
  const [single, setSingle] = React.useState("Left");
  const [multi, setMulti] = React.useState<string[]>(["Left", "Right"]);
  return (
    <div className="flex flex-col gap-6">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-3">
          <span className="text-xs text-muted-foreground">
            variant: {variant} · sizes sm / md / lg
          </span>
          <div className="flex flex-wrap items-start gap-4">
            {SIZES.map((sz) => (
              <ToggleGroup
                key={sz}
                type="single"
                variant={variant}
                size={sz}
                value={single}
                onValueChange={(v) => v && setSingle(v)}
              >
                {ITEMS.map((v) => (
                  <ToggleGroupItem key={v} value={v}>
                    {v}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            ))}
          </div>
        </div>
      ))}
      <div className="flex flex-col gap-3">
        <span className="text-xs text-muted-foreground">
          multiple (vertical)
        </span>
        <ToggleGroup
          type="multiple"
          variant="outline"
          orientation="vertical"
          value={multi}
          onValueChange={setMulti}
          className="w-fit"
        >
          {ITEMS.map((v) => (
            <ToggleGroupItem key={v} value={v}>
              {v}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
}
