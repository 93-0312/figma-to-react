import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 심볼릭 링크 없이 npm pack tarball 만 설치된 상태에서 시각 확인용 dev 앱.
export default defineConfig({
  plugins: [react()],
  server: { port: 5175, strictPort: true },
});
