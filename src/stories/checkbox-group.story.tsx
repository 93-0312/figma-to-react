import * as React from "react";
import { CheckboxGroup, CheckboxGroupItem } from "../components/ui/checkbox-group";
import type { Story } from "../playground/types";

export const checkboxGroupStory: Story = {
  name: "Checkbox Group",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=5675-291",
  controls: [
    { type: "boolean", name: "disabled", label: "disabled (그룹)", default: false },
    { type: "boolean", name: "mobile", label: "mobile (18px)", default: false },
    { type: "boolean", name: "withDescription", label: "with description", default: false },
  ],
  render: (args) => (
    <div className="w-[307px]">
      <CheckboxGroup
        aria-label="checkbox group preview"
        defaultValue={["b"]}
        disabled={Boolean(args.disabled)}
        mobile={Boolean(args.mobile)}
      >
        {(["a", "b", "c"] as const).map((v) => (
          <CheckboxGroupItem
            key={v}
            value={v}
            title="Title"
            description={args.withDescription ? "Description" : undefined}
          />
        ))}
      </CheckboxGroup>
    </div>
  ),
  gallery: <CheckboxGroupGallery />,
};

/** 부모 tri-state 데모: 부모 checked/indeterminate 는 자식 선택 상태에서 파생 */
function NestedTreeDemo() {
  const CHILDREN = ["one", "two", "three"];
  const [value, setValue] = React.useState<string[]>(["one", "two"]);
  const selected = CHILDREN.filter((c) => value.includes(c));
  const allChecked = selected.length === CHILDREN.length;
  const someChecked = selected.length > 0;
  return (
    <CheckboxGroup aria-label="nested checkbox group" value={value} onValueChange={setValue}>
      <CheckboxGroupItem
        value="parent"
        title="Parent"
        checked={someChecked}
        indeterminate={someChecked && !allChecked}
        onCheckedChange={(next) => setValue(next ? [...CHILDREN] : [])}
      />
      {CHILDREN.map((c) => (
        <CheckboxGroupItem key={c} value={c} title={`Child ${c}`} depth={1} />
      ))}
    </CheckboxGroup>
  );
}

function CheckboxGroupGallery() {
  return (
    <div className="flex flex-wrap items-start gap-12">
      {/* Figma 원본 구조: 0/1/2 단계 들여쓰기(16px/단계) */}
      <div className="w-[307px] space-y-3">
        <span className="text-sm text-muted-foreground">Figma 구조 (depth 0/1/2)</span>
        <CheckboxGroup aria-label="depth example" defaultValue={["p1", "l1", "l2"]}>
          <CheckboxGroupItem value="p1" title="Title" />
          <CheckboxGroupItem value="p2" title="Title" disabled />
          <CheckboxGroupItem value="p3" title="Title" checked indeterminate />
          <CheckboxGroupItem value="s1" title="Title" depth={1} />
          <CheckboxGroupItem value="s2" title="Title" depth={1} />
          <CheckboxGroupItem value="s3" title="Title" depth={1} checked indeterminate />
          <CheckboxGroupItem value="l1" title="Title" depth={2} />
          <CheckboxGroupItem value="l2" title="Title" depth={2} />
          <CheckboxGroupItem value="l3" title="Title" depth={2} />
        </CheckboxGroup>
      </div>

      {/* 부모-자식 연동 tri-state */}
      <div className="w-[280px] space-y-3">
        <span className="text-sm text-muted-foreground">부모 tri-state (인터랙티브)</span>
        <NestedTreeDemo />
      </div>

      {/* 설명/비활성/모바일 변형 */}
      <div className="w-[280px] space-y-3">
        <span className="text-sm text-muted-foreground">Description / Disabled / Mobile</span>
        <CheckboxGroup aria-label="variants example" defaultValue={["desc"]}>
          <CheckboxGroupItem value="desc" title="Title" description="Description" />
          <CheckboxGroupItem value="disabled" title="Disabled" description="Description" disabled />
          <CheckboxGroupItem value="mob" title="Mobile (18px)" mobile />
        </CheckboxGroup>
      </div>
    </div>
  );
}
