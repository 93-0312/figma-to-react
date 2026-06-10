import type { Args, Control } from "./types";

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
            <select
              value={String(args[c.name])}
              onChange={(e) => onChange(c.name, e.target.value)}
              className="h-8 rounded-radius border border-input bg-card px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {c.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          )}

          {c.type === "boolean" && (
            <button
              type="button"
              role="switch"
              aria-checked={Boolean(args[c.name])}
              onClick={() => onChange(c.name, !args[c.name])}
              className={
                "relative h-6 w-10 shrink-0 rounded-full border transition-colors " +
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
            <input
              type="text"
              value={String(args[c.name])}
              onChange={(e) => onChange(c.name, e.target.value)}
              className="h-8 rounded-radius border border-input bg-card px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          )}
        </label>
      ))}
    </div>
  );
}
