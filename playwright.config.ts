import { defineConfig, devices } from "@playwright/test";

/**
 * 시각 회귀(visual regression) 테스트 설정.
 * 플레이그라운드(localhost:5173)의 각 컴포넌트 스토리를 스크린샷으로 비교한다.
 * 헤드리스 추출이 "컴파일은 되지만 시각적으로 틀린" 변경을 만들 수 있어, 빌드 검증을 보완한다.
 */
export default defineConfig({
  testDir: "./tests",
  // 시각 회귀는 CI(Linux) 전용 — baseline 도 Linux 만 커밋한다.
  // 로컬(특히 Windows)은 렌더가 달라 baseline 이 불일치하고 stray 스냅샷을 만들므로
  // 비교를 건너뛴다. 로컬 개발자의 시각 점검은 PR 증거 코멘트(Linux 렌더)로 대체된다.
  ignoreSnapshots: !process.env.CI,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://localhost:5173",
  },
  expect: {
    // 같은 환경(로컬↔로컬 / CI↔CI)에선 렌더가 결정적이라 거의 0 diff.
    // maxDiffPixels 를 작게 잡아 트리비얼 AA 노이즈만 허용하고 실제 변경(수십~수천 px)은 잡는다.
    // (이전 maxDiffPixelRatio 0.02=2% 는 너무 느슨해 작은 컴포넌트 변경을 놓쳤음)
    //
    // threshold: 픽셀 단위 색차 민감도(YIQ perceptual). Playwright 기본값 0.2 는 밝기(Y)를
    // 색상(I·Q)보다 크게 가중해, 밝기가 비슷한 hue 변경(예: 파랑#2b7fff→보라#615fff,
    // delta 660 < 기본기준 1409)을 "같다"고 놓친다.
    // 0.03(기준 ~32)까지 낮춘다: 옅은 회색끼리의 미묘한 변경(예: bg-muted #foreground4%
    // → bg-secondary #e2e8f0, delta 57)도 잡기 위함. CI 는 동일 Linux·동일 Chromium·폰트
    // 로드 대기·애니메이션 비활성으로 렌더가 결정적 → 미변경 컴포넌트는 delta 0 이라
    // 임계값을 낮춰도 false positive 가 나지 않는다(실제 변경만 잡힘). maxDiffPixels:100 이
    // 잔여 버퍼.
    toHaveScreenshot: { maxDiffPixels: 100, threshold: 0.03, animations: "disabled" },
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
