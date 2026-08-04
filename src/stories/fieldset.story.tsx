import { Fieldset, FieldsetLegend } from "../components/ui/fieldset";
import { Field } from "../components/ui/field";
import { Input } from "../components/ui/input";
import type { Story } from "../playground/types";

export const fieldsetStory: Story = {
  name: "Fieldset",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7759-1108",
  controls: [
    { type: "text", name: "legend", label: "legend (title)", default: "Title" },
    { type: "boolean", name: "required", label: "첫 필드 required", default: true },
  ],
  render: (args) => (
    <div className="w-[256px]">
      <Fieldset>
        <FieldsetLegend>{String(args.legend)}</FieldsetLegend>
        <Field label="Label" required={Boolean(args.required)} description="Description">
          <Input placeholder="Placeholder" />
        </Field>
        <Field label="Label" description="Description">
          <Input placeholder="Placeholder" />
        </Field>
      </Fieldset>
    </div>
  ),
  gallery: <FieldsetGallery />,
};

function FieldsetGallery() {
  return (
    <div className="flex flex-wrap items-start gap-10">
      {/* Figma 예시 그대로: Title + Field(Description/required) ×2 */}
      <div className="w-[256px]">
        <Fieldset>
          <FieldsetLegend>Title</FieldsetLegend>
          <Field label="Label" required description="Description">
            <Input placeholder="Placeholder" />
          </Field>
          <Field label="Label" description="Description">
            <Input placeholder="Placeholder" />
          </Field>
        </Fieldset>
      </div>

      {/* 에러/값 조합 */}
      <div className="w-[256px]">
        <Fieldset>
          <FieldsetLegend>Payment</FieldsetLegend>
          <Field label="Card number" required error="Error">
            <Input placeholder="0000 0000 0000 0000" invalid />
          </Field>
          <Field label="Name">
            <Input defaultValue="Sample" />
          </Field>
        </Fieldset>
      </div>
    </div>
  );
}
