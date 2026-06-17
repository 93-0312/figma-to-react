import { Collapsible } from "../components/ui/collapsible";
import type { Story } from "../playground/types";

export const collapsibleStory: Story = {
  name: "Collapsible",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=5677-165",
  controls: [
    { type: "boolean", name: "open", label: "open", default: true },
  ],
  render: (args, setArg) => (
    <div className="w-[240px]">
      <Collapsible
        title="고급 설정"
        open={Boolean(args.open)}
        onOpenChange={(o) => setArg("open", o)}
      >
        펼쳐진 내용 영역입니다. 추가 옵션을 여기에 둡니다.
      </Collapsible>
    </div>
  ),
  gallery: (
    <div className="flex w-[240px] flex-col gap-4">
      <Collapsible title="기본 펼침" defaultOpen>
        내용이 보입니다.
      </Collapsible>
      <Collapsible title="기본 접힘">숨겨진 내용.</Collapsible>
    </div>
  ),
};
