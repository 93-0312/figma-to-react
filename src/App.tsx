import * as React from "react";
import { Playground } from "./playground/Playground";
import type { Story } from "./playground/types";
import { buttonStory } from "./stories/button.story";
import { checkboxStory } from "./stories/checkbox.story";
import { inputStory } from "./stories/input.story";
import { labelStory } from "./stories/label.story";
import { fieldStory } from "./stories/field.story";
import { inputOtpStory } from "./stories/input-otp.story";
import { meterStory } from "./stories/meter.story";
import { toggleStory } from "./stories/toggle.story";
import { toggleGroupStory } from "./stories/toggle-group.story";
import { selectStory } from "./stories/select.story";
import { switchStory } from "./stories/switch.story";
import { separatorStory } from "./stories/separator.story";
import { skeletonStory } from "./stories/skeleton.story";
import { spinnerStory } from "./stories/spinner.story";
import { textareaStory } from "./stories/textarea.story";
import { avatarStory } from "./stories/avatar.story";
import { avatarGroupStory } from "./stories/avatar-group.story";
import { badgeStory } from "./stories/badge.story";
import { numberFieldStory } from "./stories/number-field.story";
import { radioGroupStory } from "./stories/radio-group.story";
import { segmentedControlStory } from "./stories/segmented-control.story";
import { tabsStory } from "./stories/tabs.story";
import { accordionStory } from "./stories/accordion.story";
import { collapsibleStory } from "./stories/collapsible.story";
import { breadcrumbStory } from "./stories/breadcrumb.story";
import { alertStory } from "./stories/alert.story";
import { toastStory } from "./stories/toast.story";
import { tooltipStory } from "./stories/tooltip.story";
import { scrollAreaStory } from "./stories/scroll-area.story";
import { dialogStory } from "./stories/dialog.story";
import { alertDialogStory } from "./stories/alert-dialog.story";
import { sheetStory } from "./stories/sheet.story";
import { drawerStory } from "./stories/drawer.story";
import { emptyStory } from "./stories/empty.story";
import { kbdStory } from "./stories/kbd.story";
import { loaderStory } from "./stories/loader.story";
import { progressStory } from "./stories/progress.story";
import { aspectRatioStory } from "./stories/aspect-ratio.story";
import { cardStory } from "./stories/card.story";
import { fieldsetStory } from "./stories/fieldset.story";
import { checkboxGroupStory } from "./stories/checkbox-group.story";
import { inputGroupStory } from "./stories/input-group.story";
import { fileInputStory } from "./stories/file-input.story";
import { popoverStory } from "./stories/popover.story";
import { toolbarStory } from "./stories/toolbar.story";
import { paginationStory } from "./stories/pagination.story";
import { compactPaginationStory } from "./stories/compact-pagination.story";
import { formStory } from "./stories/form.story";
import { menuStory } from "./stories/menu.story";
import { comboboxStory } from "./stories/combobox.story";
import { autocompleteStory } from "./stories/autocomplete.story";
import { calendarStory } from "./stories/calendar.story";
import { datePickerStory } from "./stories/date-picker.story";
import { sliderStory } from "./stories/slider.story";
import { tooltipCursorStory } from "./stories/tooltip-cursor.story";

// 컴포넌트(스토리) 목록 — 원본 순서 유지(기본 선택/렌더 순서가 시각 스냅샷 baseline 과
// 묶여 있어 함부로 바꾸지 않는다). 사이드바 "표시" 순서만 아래 navOrder 로 알파벳 정렬한다.
const STORIES: Story[] = [
  buttonStory,
  checkboxStory,
  inputStory,
  labelStory,
  fieldStory,
  inputOtpStory,
  meterStory,
  toggleStory,
  toggleGroupStory,
  selectStory,
  switchStory,
  separatorStory,
  skeletonStory,
  spinnerStory,
  textareaStory,
  avatarStory,
  avatarGroupStory,
  badgeStory,
  numberFieldStory,
  radioGroupStory,
  segmentedControlStory,
  tabsStory,
  accordionStory,
  collapsibleStory,
  breadcrumbStory,
  alertStory,
  toastStory,
  tooltipStory,
  scrollAreaStory,
  dialogStory,
  alertDialogStory,
  sheetStory,
  drawerStory,
  emptyStory,
  kbdStory,
  loaderStory,
  progressStory,
  aspectRatioStory,
  cardStory,
  fieldsetStory,
  checkboxGroupStory,
  inputGroupStory,
  fileInputStory,
  popoverStory,
  toolbarStory,
  paginationStory,
  compactPaginationStory,
  formStory,
  menuStory,
  comboboxStory,
  autocompleteStory,
  calendarStory,
  datePickerStory,
  sliderStory,
  tooltipCursorStory,
];

// 사이드바 표시용 인덱스 순서(표시 이름 알파벳순). STORIES 자체는 원본 순서라
// active 인덱싱·기본 선택·스냅샷이 그대로 유지되고, 노출만 ABC 로 정렬된다.
const navOrder = STORIES.map((_, i) => i).sort((a, b) =>
  STORIES[a].name.localeCompare(STORIES[b].name)
);

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
            {navOrder.map((i) => {
              const s = STORIES[i];
              return (
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
              );
            })}
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
