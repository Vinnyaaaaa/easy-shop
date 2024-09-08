import path from "path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import configs from "./config";

const getServerProxy = (mode = "development") => {
  const proxyObj = configs[mode];

  return {};
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@/": `${path.resolve(__dirname, "src")}/`,
    },
  },

  css: {
    //* 预编译支持less
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
        math: "always",
        relativeUrls: true,
        // 导入token
      },
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
