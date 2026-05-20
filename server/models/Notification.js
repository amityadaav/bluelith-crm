
// import mongoose from "mongoose";

// // ─── Activity ─────────────────────────────────────────────────────────────────
// const activitySchema = new mongoose.Schema(
//   {
//     type: {
//       type: String,
//       enum: [
//         "lead_created","lead_updated","lead_won","lead_lost",
//         "client_created","client_updated",
//         "project_created","project_updated","project_completed",
//         "payment_received","user_login","note_added",
//       ],
//       required: true,
//     },
//     description: { type: String, required: true },
//     user:        { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     userName:    { type: String },
//     relatedTo: {
//       model: { type: String, enum: ["Lead","Client","Project","User"] },
//       id:    { type: mongoose.Schema.Types.ObjectId },
//     },
//     metadata: { type: mongoose.Schema.Types.Mixed },
//   },
//   { timestamps: true }
// );

// // ─── Notification ─────────────────────────────────────────────────────────────
// const notificationSchema = new mongoose.Schema(
//   {
//     title:     { type: String, required: true },
//     message:   { type: String, required: true },
//     type:      { type: String, enum: ["info","success","warning","error"], default: "info" },
//     recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     isRead:    { type: Boolean, default: false },
//     link:      { type: String },
//     relatedTo: {
//       model: { type: String, enum: ["Lead","Client","Project","User"] },
//       id:    { type: mongoose.Schema.Types.ObjectId },
//     },
//   },
//   { timestamps: true }
// );

// export const Activity     = mongoose.model("Activity",     activitySchema);
// export const Notification = mongoose.model("Notification", notificationSchema);

import mongoose from "mongoose";

// ─── Activity ─────────────────────────────────────────────────────────────────
const activitySchema = new mongoose.Schema(
  {
    type: {
      type:     String,
      required: true,
      enum: [
        "lead_created", "lead_updated", "lead_won", "lead_lost",
        "client_created", "client_updated",
        "project_created", "project_updated", "project_completed",
        "payment_received", "user_login", "user_create", "note_added",
      ],
    },
    description: { type: String, required: true },
    user:        { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName:    { type: String },
    relatedTo: {
      model: { type: String, enum: ["Lead", "Client", "Project", "User"] },
      id:    { type: mongoose.Schema.Types.ObjectId },
    },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

activitySchema.index({ createdAt: -1 });

// ─── Notification ─────────────────────────────────────────────────────────────
const notificationSchema = new mongoose.Schema(
  {
    title:   { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type:    String,
      enum:    ["info", "success", "warning", "error"],
      default: "info",
    },
    recipient: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
      index:    true,
    },
    isRead: { type: Boolean, default: false, index: true },
    link:   { type: String },
    relatedTo: {
      model: { type: String, enum: ["Lead", "Client", "Project", "User"] },
      id:    { type: mongoose.Schema.Types.ObjectId },
    },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1 });

export const Activity     = mongoose.model("Activity",     activitySchema);
export const Notification = mongoose.model("Notification", notificationSchema);
