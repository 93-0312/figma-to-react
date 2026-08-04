import type * as React from "react";
import { Kbd } from "../components/ui/kbd";
import type { Story } from "../playground/types";

/** Figma 기본 아이콘 mini/arrow-turn-right-up(1673:4773) 대응 인라인 SVG */
function ArrowTurnRightUpIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path
        d="M2.5 11h4.75a2 2 0 0 0 2-2V3.25M6.75 5.75l2.5-2.5 2.5 2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const kbdStory: Story = {
  name: "Kbd",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7658-2132",
  controls: [
    { type: "text", name: "label", label: "label", default: "K" },
    { type: "boolean", name: "background", label: "background", default: true },
    { type: "boolean", name: "isIcon", label: "isIcon (아이콘 콘텐츠)", default: false },
  ],
  render: (args) => (
    <Kbd background={Boolean(args.background)} isIcon={Boolean(args.isIcon)}>
      {args.isIcon ? <ArrowTurnRightUpIcon /> : String(args.label)}
    </Kbd>
  ),
  gallery: <KbdGallery />,
};

function KbdGallery() {
  return (
    <div className="flex flex-col gap-6">
      {/* 2^2 variant 매트릭스 (Figma 세트와 동일) */}
      <div className="flex items-center gap-6">
        <Labeled label="bg + text">
          <Kbd>K</Kbd>
        </Labeled>
        <Labeled label="bg + icon">
          <Kbd isIcon>
            <ArrowTurnRightUpIcon />
          </Kbd>
        </Labeled>
        <Labeled label="no bg + text">
          <Kbd background={false}>K</Kbd>
        </Labeled>
        <Labeled label="no bg + icon">
          <Kbd background={false} isIcon>
            <ArrowTurnRightUpIcon />
          </Kbd>
        </Labeled>
      </div>
      {/* 조합 사용 예 */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-0.5">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
        <span className="inline-flex items-center gap-0.5">
          <Kbd>Ctrl</Kbd>
          <Kbd>Shift</Kbd>
          <Kbd>P</Kbd>
        </span>
        <span className="inline-flex items-center gap-1">
          검색
          <Kbd isIcon>
            <ArrowTurnRightUpIcon />
          </Kbd>
        </span>
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
