import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import type { Story } from "../playground/types";

const OPTS = [
  { value: "free", title: "Free", desc: "개인 프로젝트용 무료 플랜" },
  { value: "pro", title: "Pro", desc: "팀 협업과 고급 기능" },
  { value: "enterprise", title: "Enterprise", desc: "전사 배포 및 지원" },
];

export const radioGroupStory: Story = {
  name: "Radio Group",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7669-1454",
  controls: [
    { type: "boolean", name: "cardStyle", label: "card style", default: false },
    { type: "boolean", name: "disabled", label: "disabled", default: false },
  ],
  render: (args, setArg) => (
    <div className="w-[240px]">
      <RadioGroup
        value={String(args.value ?? "pro")}
        onValueChange={(v) => setArg("value", v)}
        disabled={Boolean(args.disabled)}
      >
        {OPTS.map((o) => (
          <RadioGroupItem
            key={o.value}
            value={o.value}
            title={o.title}
            description={o.desc}
            cardStyle={Boolean(args.cardStyle)}
          />
        ))}
      </RadioGroup>
    </div>
  ),
  gallery: (
    <div className="flex gap-10">
      <div className="w-[200px]">
        <span className="text-xs text-muted-foreground">기본</span>
        <RadioGroup defaultValue="pro" className="mt-2">
          {OPTS.map((o) => (
            <RadioGroupItem key={o.value} value={o.value} title={o.title} description={o.desc} />
          ))}
        </RadioGroup>
      </div>
      <div className="w-[220px]">
        <span className="text-xs text-muted-foreground">card style</span>
        <RadioGroup defaultValue="free" className="mt-2">
          {OPTS.map((o) => (
            <RadioGroupItem key={o.value} value={o.value} title={o.title} description={o.desc} cardStyle />
          ))}
        </RadioGroup>
      </div>
    </div>
  ),
};
