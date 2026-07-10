/**
 * Tailwind config — "BO UI Kit" (Figma) 파운데이션을 대표하는 프로젝트 설정.
 *
 * 색상은 `rgb(var(--token) / <alpha-value>)` 채널 방식으로 노출해
 * `bg-primary/90` 같은 불투명도 유틸리티를 그대로 쓸 수 있게 했다.
 * 실제 토큰 값은 src/index.css 의 CSS 변수에서 정의한다(라이트/다크 테마 전환).
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--popover) / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--foreground) / 0.04)", // #0f172b0a 근사
          // muted-foreground 토큰(#0f172b80)은 50% 알파가 적용된 값
          foreground: "rgb(var(--muted-foreground) / 0.5)",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
        },
        success: {
          DEFAULT: "rgb(var(--success) / <alpha-value>)",
          foreground: "rgb(var(--success-foreground) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "rgb(var(--warning) / <alpha-value>)",
          foreground: "rgb(var(--warning-foreground) / <alpha-value>)",
        },
        info: {
          DEFAULT: "rgb(var(--info) / <alpha-value>)",
          foreground: "rgb(var(--info-foreground) / <alpha-value>)",
        },
        // border/input: 2026-07 Figma 갱신 — 기존엔 8% 알파 공유 토큰(#0f172b14)이었으나
        // 서로 다른 불투명 색(#e1e6ec / #dedfe2)으로 갈라짐(src/tokens.css 참고).
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        disabled: "rgb(var(--disabled) / <alpha-value>)",
        // Dialog/Sheet/Drawer 백드롭 — Figma Overlay 토큰(#101012, 32% 알파는 사용처에서).
        // ★ 이름을 `overlay` 로 두면 아래 boxShadow.overlay 와 충돌(shadow-overlay 가
        //   그림자색으로 해석됨) → `backdrop` 으로 분리.
        backdrop: "rgb(var(--backdrop) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Pretendard", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Figma typography 토큰 (size / lineHeight / letterSpacing)
        xs: ["12px", { lineHeight: "14px", letterSpacing: "0.12px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
      },
      borderRadius: {
        // Figma radius 토큰 (네이밍 그대로)
        "radius-none": "0px",
        "radius-sm": "4px",
        "radius-lg": "8px",
        radius: "10px",
        "radius-xl": "12px",
        "radius-2xl": "16px",
        "radius-full": "9999px",
      },
      boxShadow: {
        // tailwind-shadow/xs
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        // 채워진 버튼 전용: 하단 그림자 + 상단 내부 하이라이트
        btn: "0 1px 1px rgba(38, 38, 38, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.16)",
        // 플로팅 패널(Select/Sheet/Toast/Tooltip/AlertDialog) — Figma shadow-lg, 검정 5%.
        // ★ 키 이름을 `popover` 로 두면 colors.popover 와 충돌해 Tailwind 가 shadow-popover 를
        //   "그림자색=popover(흰색)" 으로 해석·덮어써 그림자가 흰색이 된다 → `overlay` 로 분리.
        overlay:
          "0px 10px 15px -3px rgba(0, 0, 0, 0.05), 0px 4px 6px -4px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
