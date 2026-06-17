import { Breadcrumb } from "../components/ui/breadcrumb";
import type { BreadcrumbProps } from "../components/ui/breadcrumb";
import type { Story } from "../playground/types";

const ITEMS = [
  { label: "홈", href: "#" },
  { label: "제품", href: "#" },
  { label: "노트북", href: "#" },
  { label: "현재 페이지" },
];

export const breadcrumbStory: Story = {
  name: "Breadcrumb",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=5665-4391",
  controls: [
    { type: "select", name: "separator", label: "separator", options: ["chevron", "slash"], default: "chevron" },
  ],
  render: (args) => (
    <Breadcrumb items={ITEMS} separator={args.separator as BreadcrumbProps["separator"]} />
  ),
  gallery: (
    <div className="flex flex-col gap-3">
      <Breadcrumb items={ITEMS} separator="chevron" />
      <Breadcrumb items={ITEMS} separator="slash" />
    </div>
  ),
};
