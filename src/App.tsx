import * as React from "react";
import { Playground } from "./playground/Playground";
import type { Story } from "./playground/types";
import { buttonStory } from "./stories/button.story";
import { checkboxStory } from "./stories/checkbox.story";
import { fieldStory } from "./stories/field.story";

const STORIES: Story[] = [buttonStory, checkboxStory, fieldStory];

export default function App() {
  const [active, setActive] = React.useState(0);
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const story = STORIES[active];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 상단 바 */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/80 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">BO UI Kit</span>
          <span className="text-sm text-muted-foreground">· React Playground</span>
        </div>
        <button
          type="button"
          onClick={() => setDark((d) => !d)}
          className="rounded-radius border border-input bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary"
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      <div className="mx-auto flex max-w-5xl gap-6 p-6">
        {/* 좌측 사이드바: 컴포넌트(스토리) 목록 */}
        <nav className="w-40 shrink-0">
          <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Components
          </h2>
          <ul className="space-y-1">
            {STORIES.map((s, i) => (
              <li key={s.name}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className={
                    "w-full rounded-radius px-2 py-1.5 text-left text-sm transition-colors " +
                    (i === active
                      ? "bg-secondary font-medium text-foreground"
                      : "text-muted-foreground hover:bg-secondary/50")
                  }
                >
                  {s.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* 메인: 플레이그라운드 */}
        <main className="min-w-0 flex-1">
          <div className="mb-4 flex items-baseline gap-3">
            <h1 className="text-base font-semibold">{story.name}</h1>
            {story.docs && (
              <a
                href={story.docs}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary underline-offset-4 hover:underline"
              >
                Figma docs ↗
              </a>
            )}
          </div>
          <Playground story={story} />
        </main>
      </div>
    </div>
  );
}
