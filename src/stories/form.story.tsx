import { Form } from "../components/ui/form";
import { Field } from "../components/ui/field";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select } from "../components/ui/select";
import type { Story } from "../playground/types";

export const formStory: Story = {
  name: "Form",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7759-1314",
  controls: [
    { type: "text", name: "submitLabel", label: "submit label", default: "Label" },
    { type: "boolean", name: "required", label: "required", default: false },
    { type: "boolean", name: "invalid", label: "invalid (error)", default: false },
  ],
  render: (args) => (
    <div className="w-[256px]">
      <Form
        onSubmit={(e) => e.preventDefault()}
      >
        <Field label="Label" htmlFor="form-a" required={Boolean(args.required)}>
          <Input id="form-a" placeholder="Placeholder" />
        </Field>
        <Field
          label="Label"
          htmlFor="form-b"
          required={Boolean(args.required)}
          error={args.invalid ? "This field is invalid." : undefined}
        >
          <Input id="form-b" placeholder="Placeholder" invalid={Boolean(args.invalid)} />
        </Field>
        <Button type="submit" className="w-full">
          {String(args.submitLabel)}
        </Button>
      </Form>
    </div>
  ),
  gallery: <FormGallery />,
};

function FormGallery() {
  return (
    <div className="flex flex-wrap items-start gap-10">
      <div className="flex w-[256px] flex-col gap-1">
        <span className="text-xs text-muted-foreground">Figma 원본 (Field ×2 + Button)</span>
        <Form>
          <Field label="Label" htmlFor="g-a">
            <Input id="g-a" placeholder="Placeholder" />
          </Field>
          <Field label="Label" htmlFor="g-b">
            <Input id="g-b" placeholder="Placeholder" />
          </Field>
          <Button type="submit" className="w-full">
            Label
          </Button>
        </Form>
      </div>

      <div className="flex w-[256px] flex-col gap-1">
        <span className="text-xs text-muted-foreground">조합 예 (Select/설명/에러 포함)</span>
        <Form>
          <Field label="이름" htmlFor="g-name" required description="실명을 입력하세요.">
            <Input id="g-name" placeholder="홍길동" />
          </Field>
          <Field label="직군" htmlFor="g-role">
            <Select
              id="g-role"
              options={[
                { value: "fe", label: "프론트엔드" },
                { value: "be", label: "백엔드" },
                { value: "design", label: "디자인" },
              ]}
              placeholder="선택…"
            />
          </Field>
          <Field label="이메일" htmlFor="g-email" required error="이메일 형식이 아닙니다.">
            <Input id="g-email" placeholder="you@example.com" invalid />
          </Field>
          <Button type="submit" className="w-full">
            제출
          </Button>
        </Form>
      </div>
    </div>
  );
}
