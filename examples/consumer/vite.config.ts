import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * 외부 소비 프로젝트 시뮬레이션.
 * @eromnet/bo-ui-kit 을 (워크스페이스 링크된) node_modules 에서 그대로 import 한다.
 * → 라이브러리의 package.json exports/타입/스타일 해석을 실제 그대로 검증.
 */
export default defineConfig({
  plugins: [react()],
  server: { port: 5174, strictPort: true },
});
