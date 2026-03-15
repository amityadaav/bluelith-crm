
// import mongoose from "mongoose"

// const LeadSchema = new mongoose.Schema({

//  name:String,
//  email:String,
//  phone:String,
//  company:String,
//  status:{
//   type:String,
//   default:"new"
//  },
//  notes:String,

//  createdAt:{
//   type:Date,
//   default:Date.now
//  }

// })

// export default mongoose.model("Lead",LeadSchema)


import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name:           { type: String, required: [true, "Lead name is required"], trim: true },
    email:          { type: String, required: [true, "Email is required"], lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, "Invalid email"] },
    phone:          { type: String },
    company:        { type: String },
    source:         { type: String, enum: ["website", "referral", "linkedin", "cold-call", "email", "other"], default: "other" },
    status:         { type: String, enum: ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"], default: "new" },
    priority:       { type: String, enum: ["low", "medium", "high"], default: "medium" },
    estimatedValue: { type: Number, default: 0 },
    notes:          { type: String },
    assignedTo:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    followUpDate:   { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);