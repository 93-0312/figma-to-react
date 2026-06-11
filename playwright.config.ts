import { defineConfig, devices } from "@playwright/test";

/**
 * 시각 회귀(visual regression) 테스트 설정.
 * 플레이그라운드(localhost:5173)의 각 컴포넌트 스토리를 스크린샷으로 비교한다.
 * 헤드리스 추출이 "컴파일은 되지만 시각적으로 틀린" 변경을 만들 수 있어, 빌드 검증을 보완한다.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://localhost:5173",
  },
  expect: {
    // 폰트/렌더 미세차 허용. 애니메이션(transition)은 고정해 안정화.
    toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: "disabled" },
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
