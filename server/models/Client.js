
// import mongoose from "mongoose";

// const clientSchema = new mongoose.Schema(
//   {
//     name:    { type: String, required: [true, "Client name is required"], trim: true },
//     email:   { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
//     phone:   { type: String },
//     company: { type: String, required: [true, "Company is required"] },
//     address: {
//       street:  String,
//       city:    String,
//       state:   String,
//       country: { type: String, default: "India" },
//       pincode: String,
//     },
//     gstNumber:         { type: String },
//     panNumber:         { type: String },
//     status:            { type: String, enum: ["active", "inactive", "prospect"], default: "active" },
//     notes:             { type: String },
//     assignedTo:        { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     convertedFromLead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Client", clientSchema);
import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, "Client name is required"],
      trim:     true,
    },
    email: {
      type:      String,
      required:  [true, "Email is required"],
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    phone:   { type: String, trim: true },
    company: {
      type:     String,
      required: [true, "Company is required"],
      trim:     true,
    },
    address: {
      street:  { type: String },
      city:    { type: String },
      state:   { type: String },
      country: { type: String, default: "India" },
      pincode: { type: String },
    },
    gstNumber: { type: String, trim: true, uppercase: true },
    panNumber: { type: String, trim: true, uppercase: true },
    status: {
      type:    String,
      enum:    ["active", "inactive", "prospect"],
      default: "active",
      index:   true,
    },
    notes:             { type: String },
    assignedTo:        { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    convertedFromLead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
