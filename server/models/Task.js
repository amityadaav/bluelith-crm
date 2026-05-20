// import mongoose from "mongoose";

// const taskSchema = new mongoose.Schema(
//   {
//     title:       { type: String, required: [true, "Task title is required"], trim: true },
//     description: { type: String, trim: true },
//     priority:    { type: String, enum: ["low", "medium", "high"], default: "medium" },
//     status:      { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
//     dueDate:     { type: Date },
//     assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     assignedBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     project:     { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
//     tags:        [{ type: String }],
//     completedAt: { type: Date },
//   },
//   { timestamps: true }
// );

// // Auto-set completedAt when status changes to completed
// taskSchema.pre("save", function () {
//   if (this.isModified("status") && this.status === "completed" && !this.completedAt) {
//     this.completedAt = new Date();
//   }
//   if (this.isModified("status") && this.status !== "completed") {
//     this.completedAt = undefined;
//   }
// });

// export default mongoose.model("Task", taskSchema);

import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type:     String,
      required: [true, "Task title is required"],
      trim:     true,
    },
    description: { type: String, trim: true },
    priority: {
      type:    String,
      enum:    ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type:    String,
      enum:    ["pending", "in-progress", "completed"],
      default: "pending",
    },
    dueDate:    { type: Date },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "Assigned user is required"] },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    project:    { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    tags:       [{ type: String, trim: true }],
    completedAt: { type: Date },
  },
  { timestamps: true }
);

// ─── Auto-set / unset completedAt ─────────────────────────────────────────────
taskSchema.pre("save", function () {
  if (!this.isModified("status")) return;
  if (this.status === "completed") {
    this.completedAt = this.completedAt || new Date();
  } else {
    this.completedAt = undefined;
  }
});

// Indexes for common queries
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ project: 1 });

export default mongoose.model("Task", taskSchema);
