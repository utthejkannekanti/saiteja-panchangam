import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/panchangam-github-app/",
  plugins: [react()],
});
