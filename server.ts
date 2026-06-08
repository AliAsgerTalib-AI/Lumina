import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { routesRouter } from "./server/routes";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON body parsing for API payloads
app.use(express.json());

// Mount the modular routes router
app.use("/api", routesRouter);

// Global Express error handler to intercept uncaught exceptions and guarantee clean JSON responses
app.use((err: any, req: any, res: any, _next: any) => {
  console.error("Global Express Error Interceptor caught:", err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || "An unexpected server-side error occurred inside the system.",
    success: false
  });
});

// Setup Vite Dev Server / Static production build serving
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start the Express server:", err);
});
