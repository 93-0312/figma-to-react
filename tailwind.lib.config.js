import base from "./tailwind.config.js";

/**
 * 라이브러리 CSS 빌드용 Tailwind 설정.
 * - 앱과 동일한 theme(색/간격/radius/타이포/shadow 토큰) 재사용.
 * - content 는 배포 대상 컴포넌트만 스캔 → 컴포넌트가 실제 쓰는 유틸만 CSS 에 포함.
 * - preflight(전역 리셋) 끔 → 소비 프로젝트의 페이지를 망가뜨리지 않음.
 *   (유틸이 동작하는 데 필요한 최소 base 는 lib/styles.css 에서 직접 정의)
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  ...base,
  content: ["./src/components/**/*.{ts,tsx}"],
  corePlugins: { ...(base.corePlugins || {}), preflight: false },
};
