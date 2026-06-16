import type * as React from "react";
import { Checkbox } from "../components/ui/checkbox";
import type { Story } from "../playground/types";

export const checkboxStory: Story = {
  name: "Checkbox",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=5667-129",
  controls: [
    { type: "boolean", name: "checked", label: "checked (selected)", default: true },
    { type: "boolean", name: "indeterminate", label: "indeterminate (부모)", default: false },
    { type: "boolean", name: "disabled", label: "disabled", default: false },
    { type: "boolean", name: "mobile", label: "mobile (18px)", default: false },
  ],
  render: (args, setArg) => (
    <Checkbox
      checked={Boolean(args.checked)}
      indeterminate={Boolean(args.indeterminate)}
      disabled={Boolean(args.disabled)}
      mobile={Boolean(args.mobile)}
      onCheckedChange={(v) => setArg("checked", v)}
      aria-label="checkbox preview"
    />
  ),
  gallery: <CheckboxGallery />,
};

const STATES = [
  { label: "Selected", props: { checked: true } },
  // indeterminate 는 checked(선택)가 true 일 때만 minus 표시
  { label: "Indeterminate", props: { checked: true, indeterminate: true } },
  { label: "Unselected", props: { checked: false } },
] as const;

function CheckboxGallery() {
  return (
    <div className="flex flex-wrap gap-10">
      {([
        { size: "Desktop · 16px", mobile: false },
        { size: "Mobile · 18px", mobile: true },
      ] as const).map((group) => (
        <div key={group.size} className="space-y-3">
          <span className="text-sm text-muted-foreground">{group.size}</span>
          {/* 헤더: Default / Disabled */}
          <div className="grid grid-cols-[120px_repeat(2,minmax(0,1fr))] items-center gap-x-6 gap-y-3">
            <span />
            <span className="text-xs text-muted-foreground">Default</span>
            <span className="text-xs text-muted-foreground">Disabled</span>

            {STATES.map((s) => (
              <Row key={s.label} label={s.label}>
                <Checkbox
                  {...s.props}
                  mobile={group.mobile}
                  onCheckedChange={() => {}}
                  aria-label={`${s.label}`}
                />
                <Checkbox
                  {...s.props}
                  disabled
                  mobile={group.mobile}
                  aria-label={`${s.label} disabled`}
                />
              </Row>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <span className="text-sm text-foreground">{label}</span>
      {children}
    </>
  );
}
