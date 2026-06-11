import { Field } from "../components/ui/field";
import { Input } from "../components/ui/input";
import type { Story } from "../playground/types";

export const fieldStory: Story = {
  name: "Field",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7745-713",
  controls: [
    { type: "text", name: "label", label: "label", default: "Label" },
    { type: "boolean", name: "required", label: "required (*)", default: true },
    { type: "text", name: "placeholder", label: "placeholder", default: "Label" },
    {
      type: "select",
      name: "helper",
      label: "helper type",
      options: ["none", "description", "error", "validity"],
      default: "none",
    },
    { type: "text", name: "helperText", label: "helper text", default: "Description" },
    { type: "boolean", name: "disabled", label: "disabled", default: false },
  ],
  render: (args) => {
    const helper = String(args.helper);
    const helperText = String(args.helperText);
    return (
      <div className="w-[260px]">
        <Field
          label={String(args.label)}
          required={Boolean(args.required)}
          htmlFor="field-preview"
          description={helper === "description" ? helperText : undefined}
          error={helper === "error" ? helperText : undefined}
          validity={helper === "validity" ? helperText : undefined}
        >
          <Input
            id="field-preview"
            placeholder={String(args.placeholder)}
            disabled={Boolean(args.disabled)}
          />
        </Field>
      </div>
    );
  },
  gallery: <FieldGallery />,
};

function FieldGallery() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <Field label="Default" required htmlFor="g-default">
        <Input id="g-default" placeholder="Label" />
      </Field>

      <Field
        label="Error"
        required
        htmlFor="g-error"
        error="이메일 형식이 올바르지 않습니다"
      >
        <Input id="g-error" placeholder="Label" defaultValue="bad@" />
      </Field>

      <Field
        label="Description"
        required
        htmlFor="g-desc"
        description="회사 이메일을 입력하세요"
      >
        <Input id="g-desc" placeholder="Label" />
      </Field>

      <Field
        label="Validity"
        required
        htmlFor="g-validity"
        validity="8자 이상, 영문/숫자 포함"
      >
        <Input id="g-validity" placeholder="Label" />
      </Field>
    </div>
  );
}
