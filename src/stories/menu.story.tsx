import {
  Menu,
  MenuItem,
  MenuGroupTitle,
  MenuSeparator,
} from "../components/ui/menu";
import type { Story } from "../playground/types";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m7 4 13 8-13 8V4Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 5v14M15 5v14" strokeLinecap="round" />
    </svg>
  );
}
function BackwardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m11 12 8-6v12l-8-6ZM5 6v12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ForwardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M13 12 5 6v12l8-6ZM19 6v12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const menuStory: Story = {
  name: "Menu",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7767-2802",
  controls: [
    { type: "boolean", name: "autoSave", label: "Auto save (switch)", default: false },
    { type: "boolean", name: "shuffleSelected", label: "Shuffle selected", default: true },
    { type: "boolean", name: "showShortcuts", label: "show shortcuts", default: true },
  ],
  render: (args, setArg) => (
    <div className="w-[200px]">
      <Menu>
        <MenuGroupTitle>Playback</MenuGroupTitle>
        <MenuItem
          icon={<PlayIcon />}
          shortcut={args.showShortcuts ? "⌘P" : undefined}
        >
          Play
        </MenuItem>
        <MenuItem
          type="disabled"
          icon={<PauseIcon />}
          shortcut={args.showShortcuts ? "⇧⌘P" : undefined}
        >
          Pause
        </MenuItem>
        <MenuItem
          icon={<BackwardIcon />}
          shortcut={args.showShortcuts ? "⌘[" : undefined}
        >
          Backward
        </MenuItem>
        <MenuItem
          icon={<ForwardIcon />}
          shortcut={args.showShortcuts ? "⌘]" : undefined}
        >
          Forward
        </MenuItem>
        <MenuSeparator />
        <MenuItem
          selected={Boolean(args.shuffleSelected)}
          onClick={() => setArg("shuffleSelected", !args.shuffleSelected)}
        >
          Shuffle
        </MenuItem>
        <MenuItem selected>Repeat</MenuItem>
        <MenuItem type="disabled" selected>
          Enhanced Audio
        </MenuItem>
        <MenuGroupTitle separator>Sort by</MenuGroupTitle>
        <MenuItem selected>Artist</MenuItem>
        <MenuItem selected>Album</MenuItem>
        <MenuItem selected>Title</MenuItem>
        <MenuSeparator />
        <MenuItem
          selected
          showSwitch
          switchChecked={Boolean(args.autoSave)}
          onSwitchChange={(v) => setArg("autoSave", v)}
        >
          Auto save
        </MenuItem>
        <MenuSeparator />
        <MenuItem selected showRightIcon>
          Add to Playlist
        </MenuItem>
        <MenuSeparator />
        <MenuItem
          type="destructive"
          icon={<TrashIcon />}
          shortcut={args.showShortcuts ? "⌘⌫" : undefined}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  ),
  gallery: <MenuGallery />,
};

/** .MenuItem 12개 variant 조합(Type×Selected/ShowLeftIcon×HighLight) 전수 렌더. */
function MenuGallery() {
  const types = ["default", "destructive", "disabled"] as const;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">
          .MenuItem 조합 (행: Type / 열: Selected=False·아이콘 → Selected=True →
          HighLight(hover 로 확인) — HighLight 정적 재현은 hover 스타일이라 마우스로 검증)
        </span>
        {types.map((t) => (
          <div key={t} className="flex items-start gap-3">
            <span className="w-20 pt-1.5 text-xs text-muted-foreground">{t}</span>
            <div className="w-[160px]">
              <Menu>
                <MenuItem
                  type={t}
                  icon={<PlayIcon />}
                  showRightIcon
                >
                  Label
                </MenuItem>
              </Menu>
            </div>
            <div className="w-[160px]">
              <Menu>
                <MenuItem type={t} selected showRightIcon>
                  Label
                </MenuItem>
              </Menu>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">부속: 스위치 / 단축키 / 그룹 타이틀·구분선</span>
        <div className="w-[200px]">
          <Menu>
            <MenuGroupTitle>Group</MenuGroupTitle>
            <MenuItem icon={<PlayIcon />} shortcut="⌘K">
              Shortcut
            </MenuItem>
            <MenuItem selected showSwitch switchChecked>
              Switch on
            </MenuItem>
            <MenuItem selected showSwitch>
              Switch off
            </MenuItem>
            <MenuGroupTitle separator>Titled group</MenuGroupTitle>
            <MenuItem selected showRightIcon>
              Submenu
            </MenuItem>
            <MenuSeparator />
            <MenuItem type="destructive" icon={<TrashIcon />}>
              Delete
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}
