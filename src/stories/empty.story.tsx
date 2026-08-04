import { Button } from "../components/ui/button";
import { Empty } from "../components/ui/empty";
import type { Story } from "../playground/types";
import { PlusIcon } from "./icons";

export const emptyStory: Story = {
  name: "Empty",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7656-2017",
  controls: [
    { type: "text", name: "title", label: "title", default: "Title" },
    { type: "text", name: "description", label: "description", default: "Description" },
    { type: "boolean", name: "showDescription", label: "showDescription", default: true },
    { type: "boolean", name: "showButtons", label: "showButtons", default: true },
    { type: "boolean", name: "showPrimaryButton", label: "primary 버튼", default: true },
    { type: "boolean", name: "showSecondaryButton", label: "secondary 버튼", default: true },
  ],
  render: (args) => (
    <Empty
      title={String(args.title)}
      description={String(args.description)}
      showDescription={Boolean(args.showDescription)}
      showButtons={Boolean(args.showButtons)}
    >
      {args.showPrimaryButton ? <Button size="sm">Label</Button> : null}
      {args.showSecondaryButton ? (
        <Button size="sm" variant="outline">
          Label
        </Button>
      ) : null}
    </Empty>
  ),
  gallery: <EmptyGallery />,
};

function EmptyGallery() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* 기본형 (Figma 기본: 제목+설명+버튼 2개) */}
      <Empty title="Title" description="Description">
        <Button size="sm">Label</Button>
        <Button size="sm" variant="outline">
          Label
        </Button>
      </Empty>
      {/* 설명 숨김 */}
      <Empty title="설명 없음" description="Description" showDescription={false}>
        <Button size="sm">Label</Button>
        <Button size="sm" variant="outline">
          Label
        </Button>
      </Empty>
      {/* 버튼 행 숨김 */}
      <Empty title="버튼 없음" description="showButtons=false" showButtons={false}>
        <Button size="sm">Label</Button>
      </Empty>
      {/* primary 버튼만 */}
      <Empty title="Primary 만" description="secondary 버튼 생략">
        <Button size="sm">Label</Button>
      </Empty>
      {/* secondary 버튼만 */}
      <Empty title="Secondary 만" description="primary 버튼 생략">
        <Button size="sm" variant="outline">
          Label
        </Button>
      </Empty>
      {/* 아이콘 스왑 (Figma Icon INSTANCE_SWAP) */}
      <Empty
        icon={<PlusIcon />}
        title="아이콘 스왑"
        description="Icon prop 으로 다른 아이콘 사용"
      >
        <Button size="sm">추가</Button>
      </Empty>
    </div>
  );
}
