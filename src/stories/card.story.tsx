import type * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Field } from "../components/ui/field";
import { Input } from "../components/ui/input";
import type { Story } from "../playground/types";

export const cardStory: Story = {
  name: "Card",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7757-807",
  controls: [
    { type: "text", name: "title", label: "title", default: "Title" },
    { type: "text", name: "description", label: "description", default: "Description" },
    { type: "boolean", name: "showForm", label: "form 예시(Figma 슬롯)", default: true },
    { type: "boolean", name: "showInfo", label: "InformationRow", default: true },
  ],
  render: (args) => (
    <div className="w-[358px]">
      <Card>
        <CardHeader>
          <CardTitle>{String(args.title)}</CardTitle>
          <CardDescription>{String(args.description)}</CardDescription>
        </CardHeader>
        {args.showForm && (
          <>
            <Field label="Label">
              <Input placeholder="Placeholder" />
            </Field>
            <Button className="w-full">Label</Button>
          </>
        )}
        {args.showInfo && <InformationRow>More Information</InformationRow>}
      </Card>
    </div>
  ),
  gallery: <CardGallery />,
};

/** Figma 슬롯 예시의 InformationRow(7757:545) — info 아이콘 + 12/16 tertiary 텍스트 */
function InformationRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1 text-tertiary-foreground">
      <InfoIcon />
      <span className="min-w-0 flex-1 text-xs leading-4">{children}</span>
    </div>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4 shrink-0" aria-hidden>
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7.5v3.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5.2" r="0.9" fill="currentColor" />
    </svg>
  );
}

function CardGallery() {
  return (
    <div className="flex flex-wrap items-start gap-6">
      {/* Figma 예시 그대로: Header + Field×2 + Button + InformationRow */}
      <div className="w-[358px]">
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <Field label="Label">
            <Input placeholder="Placeholder" />
          </Field>
          <Field label="Label">
            <Input defaultValue="Sample" />
          </Field>
          <Button className="w-full">Label</Button>
          <InformationRow>More Information</InformationRow>
        </Card>
      </div>

      <div className="flex w-[300px] flex-col gap-6">
        {/* 헤더만 */}
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
        </Card>
        {/* 자유 콘텐츠 */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <p className="text-sm text-muted-foreground">
            카드 슬롯에는 임의 콘텐츠를 배치할 수 있다.
          </p>
        </Card>
      </div>
    </div>
  );
}
