import { Input, Select } from "../components/ui";
import type { Args, Control } from "./types";

/** 토글 스위치에 쓰는 포커스 링 — Input 컴포넌트(Figma Focus)와 동일한 회색 3px 글로우 */
const focusRing =
  "outline-none focus-visible:ring-[3px] focus-visible:ring-offset-0 focus-visible:ring-disabled/[0.07]";

interface ControlsProps {
  controls: Control[];
  args: Args;
  onChange: (name: string, value: string | boolean) => void;
}

/** 컨트롤 스키마를 받아 입력 위젯들을 렌더하는 패널 (Storybook Controls 애드온 느낌) */
export function Controls({ controls, args, onChange }: ControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Controls
      </h3>
      {controls.map((c) => (
        <label key={c.name} className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-foreground">{c.label}</span>

          {c.type === "select" && (
            <Select
              value={String(args[c.name])}
              onValueChange={(v) => onChange(c.name, v)}
              options={c.options.map((o) => ({ value: o, label: o }))}
            />
          )}

          {c.type === "boolean" && (
            <button
              type="button"
              role="switch"
              aria-checked={Boolean(args[c.name])}
              onClick={() => onChange(c.name, !args[c.name])}
              className={
                "relative h-6 w-10 shrink-0 rounded-full border transition-colors " +
                focusRing +
                " " +
                (args[c.name]
                  ? "border-primary bg-primary"
                  : "border-input bg-secondary")
              }
            >
              <span
                className={
                  "absolute top-0.5 size-4 rounded-full bg-card shadow-xs transition-all " +
                  (args[c.name] ? "left-[18px]" : "left-0.5")
                }
              />
            </button>
          )}

          {c.type === "text" && (
            <Input
              type="text"
              value={String(args[c.name])}
              onChange={(e) => onChange(c.name, e.target.value)}
            />
          )}
        </label>
      ))}
    </div>
  );
}
