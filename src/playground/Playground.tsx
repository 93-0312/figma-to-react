import * as React from "react";
import { Controls } from "./Controls";
import type { Args, Story } from "./types";

/**
 * Playground — 하나의 Story 를 받아 라이브 미리보기 + 컨트롤 패널을 그린다.
 * 우측(넓은 화면)/하단(좁은 화면)에 컨트롤이 배치되는 Storybook 스타일 레이아웃.
 */
export function Playground({ story }: { story: Story }) {
  const initial = React.useMemo<Args>(
    () => Object.fromEntries(story.controls.map((c) => [c.name, c.default])),
    [story]
  );
  const [args, setArgs] = React.useState<Args>(initial);

  // 스토리가 바뀌면 args 초기화
  React.useEffect(() => setArgs(initial), [initial]);

  const onChange = (name: string, value: string | boolean) =>
    setArgs((prev) => ({ ...prev, [name]: value }));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-px overflow-hidden rounded-radius-xl border border-border bg-border lg:grid-cols-[1fr_300px]">
        {/* 미리보기 캔버스 */}
        <div
          className="flex min-h-[320px] items-center justify-center bg-background p-8"
          style={{
            backgroundImage:
              "radial-gradient(rgb(var(--foreground) / 0.06) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        >
          {story.render(args, onChange)}
        </div>

        {/* 컨트롤 패널 */}
        <aside className="bg-card p-5">
          <Controls controls={story.controls} args={args} onChange={onChange} />
        </aside>
      </div>

      {/* 현재 args 미리보기 (코드 느낌) */}
      <pre className="overflow-x-auto rounded-radius border border-border bg-card p-4 text-xs text-muted-foreground">
        {`<${story.name} ${story.controls
          .map((c) => `${c.name}={${JSON.stringify(args[c.name])}}`)
          .join(" ")} />`}
      </pre>

      {/* 정적 갤러리(기존 매트릭스 유지) */}
      {story.gallery && (
        <section>
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            전체 변형 갤러리
          </h2>
          {story.gallery}
        </section>
      )}
    </div>
  );
}
