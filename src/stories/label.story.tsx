import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import type { Story } from "../playground/types";

export const labelStory: Story = {
  name: "Label",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7658-2157",
  controls: [
    { type: "text", name: "text", label: "text", default: "Label" },
    { type: "boolean", name: "withInput", label: "연결된 Input 보기", default: true },
  ],
  render: (args) => (
    <div className="flex w-[240px] flex-col gap-1.5">
      <Label htmlFor="label-demo">{String(args.text)}</Label>
      {args.withInput && <Input id="label-demo" placeholder="..." />}
    </div>
  ),
  gallery: (
    <div className="flex flex-col gap-2">
      <Label>기본 라벨</Label>
      <Label className="text-muted-foreground">muted 라벨</Label>
    </div>
  ),
};
