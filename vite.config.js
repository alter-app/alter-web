import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    return {
        plugins: [react()],
        server: {
            proxy: {
                "/backend-api": {
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                    rewrite: (path) =>
                        path.replace(/^\/backend-api/, ""),
                },
            },
        },
    };
});
