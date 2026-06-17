import { Accordion, AccordionItem } from "../components/ui/accordion";
import type { Story } from "../playground/types";

const ITEMS = [
  { value: "a", title: "배송은 얼마나 걸리나요?", body: "영업일 기준 2~3일 소요됩니다." },
  { value: "b", title: "반품이 가능한가요?", body: "수령 후 14일 이내 반품 가능합니다." },
  { value: "c", title: "해외 배송되나요?", body: "현재 국내 배송만 지원합니다." },
];

export const accordionStory: Story = {
  name: "Accordion",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=1673-58",
  controls: [
    { type: "select", name: "type", label: "type", options: ["single", "multiple"], default: "single" },
  ],
  render: (args) => (
    <div className="w-[320px]">
      <Accordion key={String(args.type)} type={args.type as "single"} defaultValue={args.type === "multiple" ? (["a"] as never) : ("a" as never)}>
        {ITEMS.map((it) => (
          <AccordionItem key={it.value} value={it.value} title={it.title}>
            {it.body}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
  gallery: (
    <div className="w-[320px]">
      <Accordion type="single" defaultValue="a">
        {ITEMS.map((it) => (
          <AccordionItem key={it.value} value={it.value} title={it.title}>
            {it.body}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
};
