
// import mongoose from "mongoose";

// const commentSchema = new mongoose.Schema({
//   text: String,
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const projectSchema = new mongoose.Schema({

//   name:{
//     type:String,
//     required:true
//   },

//   client:{
//     type:String,
//     required:true
//   },

//   assignedDeveloper:{
//     type:String
//   },

//   totalBudget:{
//     type:Number,
//     default:0
//   },

//   paid:{
//     type:Number,
//     default:0
//   },

//   remaining:{
//     type:Number,
//     default:0
//   },

//   deadline:{
//     type:Date
//   },

//   status:{
//     type:String,
//     enum:["Pending","In Progress","Completed"],
//     default:"Pending"
//   },

//   comments:[commentSchema],

//   createdAt:{
//     type:Date,
//     default:Date.now
//   }

// });

// export default mongoose.model("Project",projectSchema);

import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: String,
  dueDate:     Date,
  amount:      { type: Number, default: 0 },
  status:      { type: String, enum: ["pending", "in-progress", "completed", "invoiced", "paid"], default: "pending" },
});

const projectSchema = new mongoose.Schema(
  {
    name:        { type: String, required: [true, "Project name is required"], trim: true },
    description: { type: String },
    client:      { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: [true, "Client is required"] },
    clientName:  { type: String },
    status:      { type: String, enum: ["pending", "active", "in-progress", "on-hold", "completed", "cancelled"], default: "pending" },
    priority:    { type: String, enum: ["low", "medium", "high"], default: "medium" },
    startDate:   { type: Date },
    endDate:     { type: Date },
    totalBudget: { type: Number, default: 0 },
    paid:        { type: Number, default: 0 },
    milestones:  [milestoneSchema],
    assignedTo:  [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tags:        [String],
    notes:       { type: String },
  },
  { timestamps: true }
);

projectSchema.virtual("pendingPayment").get(function () {
  return this.totalBudget - this.paid;
});

projectSchema.virtual("completionPercent").get(function () {
  if (!this.milestones.length) return 0;
  const done = this.milestones.filter((m) => m.status === "completed" || m.status === "paid").length;
  return Math.round((done / this.milestones.length) * 100);
});

projectSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Project", projectSchema);