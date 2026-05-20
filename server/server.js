
// import "dotenv/config";
// import express      from "express";
// import mongoose     from "mongoose";
// import cors         from "cors";
// import cookieParser from "cookie-parser";

// import authRoutes      from "./routes/authRoutes.js";
// import userRoutes      from "./routes/userRoutes.js";
// import leadRoutes      from "./routes/leadRoutes.js";
// import clientRoutes    from "./routes/clientRoutes.js";
// import projectRoutes   from "./routes/projectRoutes.js";
// import notifRoutes     from "./routes/notifications.js";
// import analyticsRoutes from "./routes/analytics.js";
// import dashboardRoutes from "./routes/dashboardRoutes.js";
// import taskRoutes from "./routes/taskRoutes.js";

// const app = express();

// // ─── Middleware ───────────────────────────────────────────────────────────────
// app.use(cors({
//   origin: ["http://localhost:5173"],
//   credentials: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // ─── Routes ───────────────────────────────────────────────────────────────────
// app.use("/api/auth",          authRoutes);
// app.use("/api/users",         userRoutes);
// app.use("/api/leads",         leadRoutes);
// app.use("/api/clients",       clientRoutes);
// app.use("/api/projects",      projectRoutes);
// app.use("/api/notifications",  notifRoutes);
// app.use("/api/analytics",     analyticsRoutes);
// app.use("/api/dashboard",     dashboardRoutes);
// app.use("/api/tasks", taskRoutes); 
// app.get("/api/health", (_, res) =>
//   res.json({ status: "ok", timestamp: new Date().toISOString() })
// );

// // ─── 404 ──────────────────────────────────────────────────────────────────────
// app.use((req, res) => {
//   res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
// });

// // ─── Global error handler ─────────────────────────────────────────────────────
// // eslint-disable-next-line no-unused-vars
// app.use((err, req, res, next) => {
//   let statusCode = err.statusCode || 500;
//   let message    = err.message    || "Internal Server Error";

//   if (err.name === "CastError")         { statusCode = 404; message = `Invalid ID: ${err.value}`; }
//   if (err.code === 11000)               { statusCode = 400; message = `Duplicate value for: ${Object.keys(err.keyValue)[0]}`; }
//   if (err.name === "ValidationError")   { statusCode = 400; message = Object.values(err.errors).map((e) => e.message).join(", "); }
//   if (err.name === "JsonWebTokenError") { statusCode = 401; message = "Invalid token."; }
//   if (err.name === "TokenExpiredError") { statusCode = 401; message = "Token expired. Please login again."; }

//   if (process.env.NODE_ENV === "development") console.error("❌", err);

//   res.status(statusCode).json({
//     success: false, message,
//     ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
//   });
// });

// // ─── Connect DB & start ───────────────────────────────────────────────────────
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB connected");
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//       console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
//     });
//   })
//   .catch((err) => { console.error("❌ MongoDB failed:", err.message); process.exit(1); });

// process.on("SIGTERM", () => mongoose.connection.close(() => process.exit(0)));

// export default app;

import "dotenv/config";
import { validateEnv } from "./config/env.js";

// ─── Validate environment before anything else ─────────────────────────────────
validateEnv();

import express         from "express";
import helmet          from "helmet";
import cors            from "cors";
import morgan          from "morgan";
import cookieParser    from "cookie-parser";
import mongoSanitize   from "express-mongo-sanitize";

import connectDB       from "./config/db.js";
import { apiLimiter }  from "./middleware/rateLimiter.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes      from "./routes/authRoutes.js";
import userRoutes      from "./routes/userRoutes.js";
import leadRoutes      from "./routes/leadRoutes.js";
import clientRoutes    from "./routes/clientRoutes.js";
import projectRoutes   from "./routes/projectRoutes.js";
import taskRoutes      from "./routes/taskRoutes.js";
import notifRoutes     from "./routes/notifications.js";
import analyticsRoutes from "./routes/analytics.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();
const isDev = process.env.NODE_ENV !== "production";

// ─── Security middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.use(mongoSanitize()); // Prevent MongoDB operator injection

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin "${origin}" is not allowed.`));
  },
  credentials: true,
}));

// ─── Request parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));         // Limit body size
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// ─── HTTP logging ─────────────────────────────────────────────────────────────
if (isDev) app.use(morgan("dev"));
else        app.use(morgan("combined"));

// ─── Global rate limiting ─────────────────────────────────────────────────────
app.use("/api", apiLimiter);

// ─── Health check (no auth, no rate limit) ────────────────────────────────────
app.get("/api/health", (_, res) =>
  res.json({
    status:      "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp:   new Date().toISOString(),
  })
);

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth",          authRoutes);
app.use("/api/users",         userRoutes);
app.use("/api/leads",         leadRoutes);
app.use("/api/clients",       clientRoutes);
app.use("/api/projects",      projectRoutes);
app.use("/api/tasks",         taskRoutes);
app.use("/api/notifications", notifRoutes);
app.use("/api/analytics",     analyticsRoutes);
app.use("/api/dashboard",     dashboardRoutes);

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start server ─────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB();
  const PORT = parseInt(process.env.PORT) || 5000;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  });

  // ─── Graceful shutdown ────────────────────────────────────────────────────
  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log("✅ HTTP server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT",  () => shutdown("SIGINT"));

  // ─── Unhandled rejections ─────────────────────────────────────────────────
  process.on("unhandledRejection", (err) => {
    console.error("🔥 Unhandled Rejection:", err.message);
    server.close(() => process.exit(1));
  });
};

start();

export default app;
