import { Spinner } from "../components/ui/spinner";
import type { SpinnerProps } from "../components/ui/spinner";
import type { Story } from "../playground/types";

const SIZES: NonNullable<SpinnerProps["size"]>[] = ["sm", "md", "lg"];

export const spinnerStory: Story = {
  name: "Spinner",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7707-393",
  controls: [
    { type: "select", name: "size", label: "size", options: SIZES, default: "md" },
  ],
  render: (args) => (
    <Spinner size={args.size as SpinnerProps["size"]} className="text-primary" />
  ),
  gallery: (
    <div className="flex items-center gap-6 text-foreground">
      {SIZES.map((sz) => (
        <div key={sz} className="flex flex-col items-center gap-2">
          <Spinner size={sz} />
          <span className="text-xs text-muted-foreground">{sz}</span>
        </div>
      ))}
      <Spinner className="text-primary" />
      <Spinner className="text-destructive" />
    </div>
  ),
};
