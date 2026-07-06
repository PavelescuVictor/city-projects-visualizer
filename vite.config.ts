import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const projectsFile = resolve(__dirname, "src/data/projects.json");

export default defineConfig({
  server: {
    watch: {
      ignored: ["**/src/data/projects.json"],
    },
  },
  plugins: [
    react(),
    {
      name: "local-project-data-api",
      configureServer(server) {
        server.watcher.unwatch(projectsFile);

        server.middlewares.use("/api/projects", (request, response) => {
          if (request.method === "GET") {
            response.setHeader("Content-Type", "application/json");
            response.setHeader("Cache-Control", "no-store");
            response.end(readFileSync(projectsFile, "utf8"));
            return;
          }

          if (request.method === "POST") {
            let body = "";

            request.on("data", (chunk) => {
              body += chunk;
            });

            request.on("end", () => {
              try {
                const parsed = JSON.parse(body);
                const serializedProjects = `${JSON.stringify(parsed, null, 2)}\n`;
                writeFileSync(projectsFile, serializedProjects);
                response.setHeader("Content-Type", "application/json");
                response.setHeader("Cache-Control", "no-store");
                response.end(serializedProjects);
              } catch {
                response.statusCode = 400;
                response.setHeader("Content-Type", "application/json");
                response.setHeader("Cache-Control", "no-store");
                response.end(JSON.stringify({ ok: false, error: "Invalid project data" }));
              }
            });

            return;
          }

          response.statusCode = 405;
          response.end("Method not allowed");
        });
      },
    },
  ],
});
