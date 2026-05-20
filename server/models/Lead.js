
// import mongoose from "mongoose";

// const leadSchema = new mongoose.Schema(
//   {
//     name:           { type: String, required: [true, "Lead name is required"], trim: true },
//     email:          { type: String, required: [true, "Email is required"], lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, "Invalid email"] },
//     phone:          { type: String },
//     company:        { type: String },
//     source:         { type: String, enum: ["website", "referral", "linkedin", "cold-call", "email", "other"], default: "other" },
//     status:         { type: String, enum: ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"], default: "new" },
//     priority:       { type: String, enum: ["low", "medium", "high"], default: "medium" },
//     estimatedValue: { type: Number, default: 0 },
//     notes:          { type: String },
//     assignedTo:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     followUpDate:   { type: Date },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Lead", leadSchema);
import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, "Lead name is required"],
      trim:     true,
    },
    email: {
      type:      String,
      required:  [true, "Email is required"],
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone:   { type: String, trim: true },
    company: { type: String, trim: true },
    source: {
      type:    String,
      enum:    ["website", "referral", "linkedin", "cold-call", "email", "other"],
      default: "other",
    },
    status: {
      type:    String,
      enum:    ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"],
      default: "new",
      index:   true,
    },
    priority: {
      type:    String,
      enum:    ["low", "medium", "high"],
      default: "medium",
    },
    estimatedValue: { type: Number, default: 0, min: 0 },
    notes:          { type: String },
    assignedTo:     { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    followUpDate:   { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
