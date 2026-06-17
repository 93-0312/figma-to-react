import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import type { TabsProps } from "../components/ui/tabs";
import type { Story } from "../playground/types";

const TABS = [
  { value: "account", label: "계정" },
  { value: "password", label: "비밀번호" },
  { value: "team", label: "팀" },
];

export const tabsStory: Story = {
  name: "Tabs",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7722-82",
  controls: [
    { type: "select", name: "variant", label: "variant", options: ["default", "line"], default: "default" },
  ],
  render: (args, setArg) => (
    <div className="w-[320px]">
      <Tabs
        variant={args.variant as TabsProps["variant"]}
        value={String(args.value ?? "account")}
        onValueChange={(v) => setArg("value", v)}
      >
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((t) => (
          <TabsContent key={t.value} value={t.value}>
            {t.label} 패널 내용입니다.
          </TabsContent>
        ))}
      </Tabs>
    </div>
  ),
  gallery: (
    <div className="flex flex-col gap-6">
      {(["default", "line"] as const).map((v) => (
        <div key={v} className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground">{v}</span>
          <Tabs variant={v} defaultValue="account" className="w-[320px]">
            <TabsList>
              {TABS.map((t) => (
                <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      ))}
    </div>
  ),
};
