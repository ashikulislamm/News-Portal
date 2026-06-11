import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import config from "./config/config.js";
import connectDB from "./config/db.js";
import apiRoutes from "./routes/index.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.js";
import logger from "./utils/logger.js";

// Needed for path mapping in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.join(__dirname, "../frontend/build");

// Connect to MongoDB
connectDB();

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Required for serving uploads static images
}));

// CORS configuration based on config values
const corsOptions = {
  origin: config.corsOrigin === "*" ? true : config.corsOrigin,
  credentials: true,
};
app.use(cors(corsOptions));

// Body parsers
app.use(express.json({ limit: "10kb" })); // Restrict JSON payload sizes to prevent body-parsing exhaustion
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Serve uploads statically and UI bundle
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(buildPath));

// Health check endpoint (for monitoring / deployment)
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  const isHealthy = dbState === 1;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "UP" : "DOWN",
    timestamp: new Date().toISOString(),
    services: {
      database: states[dbState] || "unknown",
    },
  });
});

// Mount API routes with global rate limiter
app.use("/api", apiLimiter, apiRoutes);

// Fallback for SPA routing: serve frontend index.html for undefined non-API paths
app.get("/*catchall", (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(buildPath, "index.html"), (err) => {
    if (err) {
      // If index.html doesn't exist (e.g. build path is not built yet), fallback to route handler
      next();
    }
  });
});

// Error Middleware handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start the server
const server = app.listen(config.port, () => {
  logger.info(`Server running in ${config.env} mode on port ${config.port}`);
});

// Graceful Shutdown handlers
const shutdown = (signal) => {
  logger.warn(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close(async () => {
    logger.info("Express server closed.");
    try {
      await mongoose.connection.close(false);
      logger.info("MongoDB connection closed.");
      process.exit(0);
    } catch (err) {
      logger.error("Error closing MongoDB connection:", err);
      process.exit(1);
    }
  });

  // Force close after 10s if graceful fails
  setTimeout(() => {
    logger.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", { promise, reason: reason.stack || reason });
  // Recommended to restart the container under orchestrators
});
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception thrown:", { error: error.stack || error.message });
  process.exit(1);
});
