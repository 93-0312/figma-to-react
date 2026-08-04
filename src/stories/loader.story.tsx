import type * as React from "react";
import { Loader } from "../components/ui/loader";
import type { LoaderProps } from "../components/ui/loader";
import type { Story } from "../playground/types";

const SIZES: NonNullable<LoaderProps["size"]>[] = ["md", "lg"];

export const loaderStory: Story = {
  name: "Loader",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=9942-43552",
  controls: [
    { type: "select", name: "size", label: "size", options: SIZES, default: "md" },
    { type: "boolean", name: "determinate", label: "determinate", default: false },
    { type: "text", name: "value", label: "value (0~100, determinate)", default: "75" },
  ],
  render: (args) => {
    const v = Number(args.value);
    return (
      <Loader
        size={args.size as LoaderProps["size"]}
        determinate={Boolean(args.determinate)}
        value={Number.isFinite(v) ? v : 0}
      />
    );
  },
  gallery: <LoaderGallery />,
};

function LoaderGallery() {
  return (
    <div className="flex flex-col gap-8 text-foreground">
      {/* 2^2 variant 매트릭스 (Figma 세트와 동일 — determinate 도안은 75%) */}
      <div className="flex items-end gap-8">
        <Labeled label="indeterminate md">
          <Loader size="md" />
        </Labeled>
        <Labeled label="indeterminate lg">
          <Loader size="lg" />
        </Labeled>
        <Labeled label="determinate md 75%">
          <Loader size="md" determinate value={75} />
        </Labeled>
        <Labeled label="determinate lg 75%">
          <Loader size="lg" determinate value={75} />
        </Labeled>
      </div>
      {/* determinate 값 스윕 (0/25/50/75/100 엣지 포함) */}
      <div className="flex items-end gap-6">
        {[0, 25, 50, 75, 100].map((v) => (
          <Labeled key={v} label={`${v}%`}>
            <Loader size="lg" determinate value={v} />
          </Labeled>
        ))}
      </div>
      <div className="flex items-end gap-6">
        {[0, 25, 50, 75, 100].map((v) => (
          <Labeled key={v} label={`${v}%`}>
            <Loader size="md" determinate value={v} />
          </Labeled>
        ))}
      </div>
      {/* 색 상속 (currentColor) */}
      <div className="flex items-end gap-6">
        <Loader className="text-primary" />
        <Loader className="text-destructive" determinate value={60} />
        <Loader size="lg" className="text-primary" determinate value={60} />
      </div>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
