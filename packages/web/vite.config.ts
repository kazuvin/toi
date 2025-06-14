import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [
    ...(mode !== "test"
      ? [
          remix({
            ssr: false,
            future: {
              v3_fetcherPersist: true,
              v3_relativeSplatPath: true,
              v3_throwAbortReason: true,
              v3_singleFetch: true,
              v3_lazyRouteDiscovery: true,
            },
            ignoredRouteFiles: ["**/*.test.{js,jsx,ts,tsx}"],
          }),
        ]
      : []),
    tsconfigPaths(),
  ],
  build: {
    rollupOptions: {
      external: (id) => {
        // テストファイルとVitest関連をビルドから除外
        return id.includes('.test.') || 
               id.includes('vitest') || 
               id.includes('@testing-library') ||
               id.includes('@vitest');
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./app/test/setup.ts"],
  },
}));
