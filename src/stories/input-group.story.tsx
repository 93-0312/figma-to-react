import { InputGroup, InputGroupKbd } from "../components/ui/input-group";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import type { Story } from "../playground/types";

/** Figma `Additional` variant 8종 (node 7857:9348) */
const ADDITIONALS = [
  "Default",
  "EndIcon",
  "StartAndEndText",
  "Button",
  "Badge",
  "KeyboardShortcut",
  "LoadingSpinner",
  "InnerLabel",
] as const;
type Additional = (typeof ADDITIONALS)[number];

function renderVariant(additional: Additional, opts?: { invalid?: boolean; disabled?: boolean }) {
  const common = { invalid: opts?.invalid, disabled: opts?.disabled };
  switch (additional) {
    case "Default":
      return <InputGroup placeholder="Search" leftIcon={<SearchIcon />} {...common} />;
    case "EndIcon":
      return <InputGroup placeholder="Email" rightIcon={<MailIcon />} {...common} />;
    case "StartAndEndText":
      return <InputGroup placeholder="coss" prefix="https://" suffix=".com" {...common} />;
    case "Button":
      return (
        <InputGroup
          placeholder="Type to search"
          button={<Button size="xs">Search</Button>}
          {...common}
        />
      );
    case "Badge":
      return (
        <InputGroup
          placeholder="Type to search"
          badge={<Badge color="info">Badge</Badge>}
          {...common}
        />
      );
    case "KeyboardShortcut":
      return (
        <InputGroup placeholder="Search" kbd={<InputGroupKbd>⌘K</InputGroupKbd>} {...common} />
      );
    case "LoadingSpinner":
      return <InputGroup placeholder="Label" loading {...common} />;
    case "InnerLabel":
      return (
        <InputGroup
          innerLabel="Email"
          rightIcon={<InfoIcon />}
          placeholder="team@coss.com"
          {...common}
        />
      );
  }
}

export const inputGroupStory: Story = {
  name: "Input Group",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7857-9348",
  controls: [
    {
      type: "select",
      name: "additional",
      label: "Additional (Figma variant)",
      options: [...ADDITIONALS],
      default: "Default",
    },
    { type: "boolean", name: "invalid", label: "invalid (error)", default: false },
    { type: "boolean", name: "disabled", label: "disabled", default: false },
  ],
  render: (args) => (
    <div className="w-[240px]">
      {renderVariant(args.additional as Additional, {
        invalid: Boolean(args.invalid),
        disabled: Boolean(args.disabled),
      })}
    </div>
  ),
  gallery: <InputGroupGallery />,
};

function InputGroupGallery() {
  return (
    <div className="flex w-[240px] flex-col gap-5">
      {ADDITIONALS.map((a) => (
        <label key={a} className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">{a}</span>
          {renderVariant(a)}
        </label>
      ))}
    </div>
  );
}

/* Figma payload 의 단순 도형 아이콘 — 인라인 SVG(currentColor) */
function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4 text-tertiary-foreground" aria-hidden>
      <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="m10.7 10.7 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4 text-tertiary-foreground" aria-hidden>
      <rect
        x="1.75"
        y="3.25"
        width="12.5"
        height="9.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m2.5 4.5 5.5 4 5.5-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4 text-tertiary-foreground" aria-hidden>
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7.5v3.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5.2" r="0.9" fill="currentColor" />
    </svg>
  );
}
