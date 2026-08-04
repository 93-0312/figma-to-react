import { test, expect } from "@playwright/test";

/**
 * 각 컴포넌트 스토리의 플레이그라운드(미리보기 + 컨트롤 + 갤러리)를 스냅샷 비교.
 * baseline 갱신: `npm run test:visual:update`
 */
// 주의: 스냅샷 baseline 은 이 배열 순서로 생성돼 있어, 순서를 바꾸면 비교가 어긋난다.
// (사이드바 노출 순서는 App.tsx 에서 별도로 알파벳 정렬 — 테스트는 이름으로 클릭하므로 무관.)
const STORIES = [
  "Button",
  "Checkbox",
  "Input",
  "Label",
  "Field",
  "Input OTP",
  "Meter",
  "Toggle",
  "Toggle Group",
  "Select",
  "Switch",
  "Separator",
  "Skeleton",
  "Spinner",
  "Textarea",
  "Avatar",
  "Avatar Group",
  "Badge",
  "Number Field",
  "Radio Group",
  "Segmented Control",
  "Tabs",
  "Accordion",
  "Collapsible",
  "Breadcrumb",
  "Alert",
  "Toast",
  "Tooltip",
  "Scroll Area",
  "Dialog",
  "Alert Dialog",
  "Sheet",
  "Drawer",
  "Empty",
  "Kbd",
  "Loader",
  "Progress",
  "AspectRatio",
  "Card",
  "Fieldset",
  "Checkbox Group",
  "Input Group",
  "Popover",
  "Toolbar",
  "Pagination",
  "Compact Pagination",
  "Form",
  "Menu",
  "ComboBox",
  "Autocomplete",
  "Calendar",
  "DatePicker",
  "Slider",
  "Tooltip (withCursor)",
] as const;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  // Pretendard(CDN) 폰트 로드 완료까지 대기 → 폰트 미로딩으로 인한 diff 방지
  await page.evaluate(() => document.fonts.ready);
});

for (const name of STORIES) {
  test(`${name} 플레이그라운드 시각 스냅샷`, async ({ page }) => {
    await page
      .locator("nav")
      .getByRole("button", { name, exact: true })
      .click();
    await page.waitForTimeout(400); // 탭 전환 렌더 안정화
    await expect(page.locator("main")).toHaveScreenshot(`${name}.png`, {
      fullPage: false,
    });
  });
}
