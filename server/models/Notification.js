// import mongoose from "mongoose";

// const NotificationSchema = new mongoose.Schema({

// message:String,

// type:String,

// createdAt:{
// type:Date,
// default:Date.now
// }

// });

// export default mongoose.model("Notification",NotificationSchema);

import mongoose from "mongoose";

// ─── Activity ─────────────────────────────────────────────────────────────────
const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "lead_created","lead_updated","lead_won","lead_lost",
        "client_created","client_updated",
        "project_created","project_updated","project_completed",
        "payment_received","user_login","note_added",
      ],
      required: true,
    },
    description: { type: String, required: true },
    user:        { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName:    { type: String },
    relatedTo: {
      model: { type: String, enum: ["Lead","Client","Project","User"] },
      id:    { type: mongoose.Schema.Types.ObjectId },
    },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

// ─── Notification ─────────────────────────────────────────────────────────────
const notificationSchema = new mongoose.Schema(
  {
    title:     { type: String, required: true },
    message:   { type: String, required: true },
    type:      { type: String, enum: ["info","success","warning","error"], default: "info" },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isRead:    { type: Boolean, default: false },
    link:      { type: String },
    relatedTo: {
      model: { type: String, enum: ["Lead","Client","Project","User"] },
      id:    { type: mongoose.Schema.Types.ObjectId },
    },
  },
  { timestamps: true }
);

export const Activity     = mongoose.model("Activity",     activitySchema);
export const Notification = mongoose.model("Notification", notificationSchema);