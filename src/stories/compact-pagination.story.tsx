import { CompactPagination } from "../components/ui/compact-pagination";
import type { Story } from "../playground/types";

export const compactPaginationStory: Story = {
  name: "Compact Pagination",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=9705-87310",
  controls: [
    {
      type: "select",
      name: "page",
      label: "page (Selected)",
      options: ["1", "2", "3", "4", "5", "6", "7", "8"],
      default: "1",
    },
    {
      type: "select",
      name: "count",
      label: "count (Count — 8 = 6+)",
      options: ["2", "3", "4", "5", "8"],
      default: "5",
    },
    { type: "boolean", name: "ambient", label: "ambient", default: false },
    { type: "boolean", name: "timeBased", label: "time-based", default: false },
  ],
  render: (args, setArg) => (
    <div
      className={
        Boolean(args.ambient)
          ? "rounded-radius-xl bg-gradient-to-br from-primary/40 via-warning/30 to-destructive/30 p-10"
          : "p-10"
      }
    >
      <CompactPagination
        page={Number(args.page) || 1}
        count={Number(args.count) || 5}
        ambient={Boolean(args.ambient)}
        timeBased={Boolean(args.timeBased)}
        onPageChange={(p) => setArg("page", String(p))}
      />
    </div>
  ),
  gallery: <CompactPaginationGallery />,
};

/**
 * Figma COMPONENT_SET 매트릭스 재현:
 * Selected(1~5) × Count(2~5, 6+) × Ambient(F/T) × Time-based(F/T) — 엣지(6+ windowing) 포함.
 */
function CompactPaginationGallery() {
  const counts = [2, 3, 4, 5] as const;
  const sixPlusPages = [1, 2, 4, 7, 8]; // count=8 에서 첫/둘째/중간/끝-1/끝 → Figma 6+ 5변형 재현

  const matrix = (ambient: boolean, timeBased: boolean) => (
    <div className="flex flex-col items-start gap-2">
      {counts.map((count) => (
        <div key={count} className="flex items-center gap-4">
          <span className="w-14 text-xs text-muted-foreground">Count {count}</span>
          {Array.from({ length: count }, (_, i) => (
            <CompactPagination
              key={i}
              count={count}
              defaultPage={i + 1}
              ambient={ambient}
              timeBased={timeBased}
            />
          ))}
        </div>
      ))}
      <div className="flex items-center gap-4">
        <span className="w-14 text-xs text-muted-foreground">6+ (8)</span>
        {sixPlusPages.map((p) => (
          <CompactPagination
            key={p}
            count={8}
            defaultPage={p}
            ambient={ambient}
            timeBased={timeBased}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <span className="text-xs font-medium text-foreground">Ambient=False · Time-based=False</span>
        {matrix(false, false)}
      </section>
      <section className="flex flex-col gap-2">
        <span className="text-xs font-medium text-foreground">Ambient=False · Time-based=True</span>
        {matrix(false, true)}
      </section>
      <section className="flex flex-col gap-2">
        <span className="text-xs font-medium text-foreground">
          Ambient=True (blur 배경 확인용 그라데이션 위) · Time-based=False
        </span>
        <div className="rounded-radius-xl bg-gradient-to-br from-primary/40 via-warning/30 to-destructive/30 p-6">
          {matrix(true, false)}
        </div>
      </section>
      <section className="flex flex-col gap-2">
        <span className="text-xs font-medium text-foreground">Ambient=True · Time-based=True</span>
        <div className="rounded-radius-xl bg-gradient-to-br from-success/40 via-primary/30 to-warning/30 p-6">
          {matrix(true, true)}
        </div>
      </section>
    </div>
  );
}
