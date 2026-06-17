import { Skeleton } from "../components/ui/skeleton";
import type { Story } from "../playground/types";

export const skeletonStory: Story = {
  name: "Skeleton",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7669-1885",
  controls: [],
  render: () => (
    // Figma Skeleton 예시 레이아웃(아바타+텍스트+버튼)을 프리미티브로 조합
    <div className="flex w-[280px] items-center gap-4">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-1 flex-col gap-1">
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-1">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 flex-1" />
        </div>
      </div>
      <Skeleton className="h-6 w-[60px]" />
    </div>
  ),
  gallery: (
    <div className="flex flex-col gap-3">
      <span className="text-xs text-muted-foreground">기본 단위(크기·모양은 className)</span>
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[160px]" />
      <div className="flex items-center gap-3">
        <Skeleton className="size-12 rounded-full" />
        <Skeleton className="h-8 w-[120px]" />
      </div>
    </div>
  ),
};
