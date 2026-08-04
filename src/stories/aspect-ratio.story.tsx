import { AspectRatio } from "../components/ui/aspect-ratio";
import type { AspectRatioProps } from "../components/ui/aspect-ratio";
import type { Story } from "../playground/types";

/** Figma Ratio variant 12종 (세트 순서 그대로) */
const RATIOS = [
  "2:3",
  "16:10",
  "1.618:1",
  "16:9",
  "2:1",
  "3:2",
  "5:2",
  "3:1",
  "9:16",
  "4:3",
  "1:1",
  "3:4",
] as const;

/** Figma Image SLOT 대응 플레이스홀더 (외부 에셋 없이 토큰 그라디언트) */
function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex size-full items-center justify-center bg-gradient-to-br from-secondary via-accent to-primary/30">
      <span className="text-xs font-medium text-secondary-foreground">{label}</span>
    </div>
  );
}

export const aspectRatioStory: Story = {
  name: "AspectRatio",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=10178-8651",
  controls: [
    {
      type: "select",
      name: "ratio",
      label: "ratio",
      options: [...RATIOS],
      default: "16:10",
    },
    { type: "boolean", name: "mask", label: "mask (하단 페이드)", default: false },
  ],
  render: (args) => (
    <div className="w-[240px]">
      <AspectRatio
        ratio={args.ratio as AspectRatioProps["ratio"]}
        mask={Boolean(args.mask)}
      >
        <Placeholder label={String(args.ratio)} />
      </AspectRatio>
    </div>
  ),
  gallery: <AspectRatioGallery />,
};

function AspectRatioGallery() {
  return (
    <div className="flex flex-col gap-8">
      {/* Ratio 12종 전체 (Figma 세트와 동일) */}
      <div className="grid grid-cols-2 items-start gap-4 md:grid-cols-4">
        {RATIOS.map((r) => (
          <AspectRatio key={r} ratio={r}>
            <Placeholder label={r} />
          </AspectRatio>
        ))}
      </div>
      {/* Mask 조합 + 숫자 ratio 엣지 */}
      <div className="grid grid-cols-2 items-start gap-4 md:grid-cols-4">
        <AspectRatio ratio="16:10" mask>
          <Placeholder label="16:10 + mask" />
        </AspectRatio>
        <AspectRatio ratio="1:1" mask>
          <Placeholder label="1:1 + mask" />
        </AspectRatio>
        <AspectRatio ratio={21 / 9}>
          <Placeholder label="숫자 21/9" />
        </AspectRatio>
        <AspectRatio ratio="9:16" mask>
          <Placeholder label="9:16 + mask" />
        </AspectRatio>
      </div>
    </div>
  );
}
