import { test, expect } from "@playwright/test";

/**
 * 각 컴포넌트 스토리의 플레이그라운드(미리보기 + 컨트롤 + 갤러리)를 스냅샷 비교.
 * baseline 갱신: `npm run test:visual:update`
 */
// 표시 이름 알파벳순(App.tsx 사이드바 순서와 일치).
const STORIES = [
  "Accordion",
  "Alert",
  "Alert Dialog",
  "Avatar",
  "Avatar Group",
  "Badge",
  "Breadcrumb",
  "Button",
  "Checkbox",
  "Collapsible",
  "Dialog",
  "Drawer",
  "Field",
  "Input",
  "Input OTP",
  "Label",
  "Meter",
  "Number Field",
  "Radio Group",
  "Scroll Area",
  "Segmented Control",
  "Select",
  "Separator",
  "Sheet",
  "Skeleton",
  "Spinner",
  "Switch",
  "Tabs",
  "Textarea",
  "Toast",
  "Toggle",
  "Toggle Group",
  "Tooltip",
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
