import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * 라이브러리 빌드 설정 (npm 배포용). 앱 빌드(vite.config / index.html)와 분리.
 * 엔트리 = 컴포넌트 배럴. react/cva/clsx/tailwind-merge 는 external(소비자 번들이 해결).
 * 결과: dist/index.js (ESM) + dist/index.cjs (CommonJS). 타입은 tsc, CSS 는 tailwind CLI.
 */
export default defineConfig({
  plugins: [react()],
  // 라이브러리 배포물엔 앱 전용 에셋을 넣지 않는다. public/(self-host Pretendard woff2 등)을
  // dist 로 복사하면 배포 tarball 이 불필요하게 비대해진다(폰트는 소비자가 제공, system 폴백).
  publicDir: false,
  build: {
    lib: {
      entry: "src/components/ui/index.ts",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
      ],
    },
  },
});
