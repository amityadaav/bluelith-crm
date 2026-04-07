// // import express from "express"
// // import mongoose from "mongoose"
// // import cors from "cors"
// // import dotenv from "dotenv"

// // import authRoutes from "./routes/authRoutes.js"
// // import leadRoutes from "./routes/leadRoutes.js"
// // import clientRoutes from "./routes/clientRoutes.js"
// // import projectRoutes from "./routes/projectRoutes.js"
// // import dashboardRoutes from "./routes/dashboardRoutes.js"
// // import userRoutes from "./routes/userRoutes.js"
// // import analyticsRoutes from "./routes/analytics.js";
// // import notificationRoutes from "./routes/notifications.js";
// // dotenv.config()

// // const app = express()

// // app.use(cors())
// // app.use(express.json())

// // // MongoDB connection
// // mongoose.connect(process.env.MONGO_URI)
// // .then(()=>console.log("✅ MongoDB Connected"))
// // .catch(err=>console.log("❌ MongoDB Error:",err))



// // app.use(cors({
// //   origin: "http://localhost:5173", // your frontend URL (Vite default)
// //   credentials: true
// // }));
// // // Routes
// // app.use("/api/auth",authRoutes)
// // app.use("/api/leads",leadRoutes)
// // app.use("/api/clients",clientRoutes)
// // app.use("/api/projects",projectRoutes)
// // app.use("/api/dashboard",dashboardRoutes)
// // app.use("/api/users",userRoutes)
// // app.use("/api/analytics",analyticsRoutes);
// // app.use("/api/notifications",notificationRoutes);

// // app.get("/",(req,res)=>{
// // res.json({message:"Bluelith CRM API running"})
// // })

// // const PORT = process.env.PORT || 5000

// // app.listen(PORT,()=>{
// // console.log(`🚀 Server running on port ${PORT}`)
// // })

// import express from "express"
// import mongoose from "mongoose"
// import cors from "cors"
// import dotenv from "dotenv"
// import authRoutes from "./routes/authRoutes.js"
// import leadRoutes from "./routes/leadRoutes.js"
// import clientRoutes from "./routes/clientRoutes.js"
// import projectRoutes from "./routes/projectRoutes.js"
// import dashboardRoutes from "./routes/dashboardRoutes.js"
// import userRoutes from "./routes/userRoutes.js"
// import analyticsRoutes from "./routes/analytics.js"
// import notificationRoutes from "./routes/notifications.js"

// dotenv.config()

// const app = express()

// // ✅ ONE cors config, BEFORE everything else
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }))

// app.use(express.json())

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch(err => console.log("❌ MongoDB Error:", err))

// // Routes
// app.use("/api/auth", authRoutes)
// app.use("/api/leads", leadRoutes)
// app.use("/api/clients", clientRoutes)
// app.use("/api/projects", projectRoutes)
// app.use("/api/dashboard", dashboardRoutes)
// app.use("/api/users", userRoutes)
// app.use("/api/analytics", analyticsRoutes)
// app.use("/api/notifications", notificationRoutes)

// app.get("/", (req, res) => {
//   res.json({ message: "Bluelith CRM API running" })
// })

// const PORT = process.env.PORT || 5000
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`)
// })

import "dotenv/config";
import express      from "express";
import mongoose     from "mongoose";
import cors         from "cors";
import cookieParser from "cookie-parser";

import authRoutes      from "./routes/authRoutes.js";
import userRoutes      from "./routes/userRoutes.js";
import leadRoutes      from "./routes/leadRoutes.js";
import clientRoutes    from "./routes/clientRoutes.js";
import projectRoutes   from "./routes/projectRoutes.js";
import notifRoutes     from "./routes/notifications.js";
import analyticsRoutes from "./routes/analytics.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",          authRoutes);
app.use("/api/users",         userRoutes);
app.use("/api/leads",         leadRoutes);
app.use("/api/clients",       clientRoutes);
app.use("/api/projects",      projectRoutes);
app.use("/api/notifications",  notifRoutes);
app.use("/api/analytics",     analyticsRoutes);
app.use("/api/dashboard",     dashboardRoutes);
app.use("/api/tasks", taskRoutes); 
app.get("/api/health", (_, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// ─── Global error handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || "Internal Server Error";

  if (err.name === "CastError")         { statusCode = 404; message = `Invalid ID: ${err.value}`; }
  if (err.code === 11000)               { statusCode = 400; message = `Duplicate value for: ${Object.keys(err.keyValue)[0]}`; }
  if (err.name === "ValidationError")   { statusCode = 400; message = Object.values(err.errors).map((e) => e.message).join(", "); }
  if (err.name === "JsonWebTokenError") { statusCode = 401; message = "Invalid token."; }
  if (err.name === "TokenExpiredError") { statusCode = 401; message = "Token expired. Please login again."; }

  if (process.env.NODE_ENV === "development") console.error("❌", err);

  res.status(statusCode).json({
    success: false, message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ─── Connect DB & start ───────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((err) => { console.error("❌ MongoDB failed:", err.message); process.exit(1); });

process.on("SIGTERM", () => mongoose.connection.close(() => process.exit(0)));

export default app;