import { test, expect } from "@playwright/test";

/**
 * 각 컴포넌트 스토리의 플레이그라운드(미리보기 + 컨트롤 + 갤러리)를 스냅샷 비교.
 * baseline 갱신: `npm run test:visual:update`
 */
const STORIES = ["Button", "Checkbox", "Input", "Label", "Field", "Input OTP", "Meter", "Toggle", "Toggle Group", "Select", "Switch", "Separator", "Skeleton", "Spinner", "Textarea", "Avatar", "Avatar Group", "Badge", "Number Field", "Radio Group", "Segmented Control", "Tabs", "Accordion", "Collapsible", "Breadcrumb", "Alert", "Toast", "Tooltip", "Scroll Area"] as const;

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
