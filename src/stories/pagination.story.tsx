import { Pagination } from "../components/ui/pagination";
import type { Story } from "../playground/types";

export const paginationStory: Story = {
  name: "Pagination",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=9705-87844",
  controls: [
    {
      type: "select",
      name: "page",
      label: "page",
      options: Array.from({ length: 10 }, (_, i) => String(i + 1)),
      default: "1",
    },
    { type: "text", name: "pageCount", label: "pageCount", default: "10" },
  ],
  render: (args, setArg) => (
    <Pagination
      page={Number(args.page) || 1}
      pageCount={Math.max(1, Number(args.pageCount) || 10)}
      onPageChange={(p) => setArg("page", String(p))}
    />
  ),
  gallery: <PaginationGallery />,
};

function PaginationGallery() {
  return (
    <div className="flex flex-col items-start gap-6">
      {(
        [
          { label: "Figma 원본 형태 — 10페이지 중 1페이지 (이전 disabled + 우측 …)", page: 1, count: 10 },
          { label: "중간 페이지 — 양쪽 … (5/10)", page: 5, count: 10 },
          { label: "마지막 페이지 — 다음 disabled (10/10)", page: 10, count: 10 },
          { label: "페이지 적음 — … 없음 (2/5)", page: 2, count: 5 },
          { label: "1페이지뿐 — 양쪽 disabled", page: 1, count: 1 },
        ] as const
      ).map((s) => (
        <div key={s.label} className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{s.label}</span>
          <Pagination defaultPage={s.page} pageCount={s.count} />
        </div>
      ))}
    </div>
  );
}
