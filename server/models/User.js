
// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: [true, "Name is required"], 
//     trim: true 
//   },
//   email: { 
//     type: String, 
//     required: [true, "Email is required"], 
//     unique: true, 
//     lowercase: true, 
//     trim: true,
//     match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
//   },
//   password: { 
//     type: String, 
//     required: [true, "Password is required"], 
//     minlength: 6, 
//     select: false 
//   },
//   role: { 
//     type: String, 
//     enum: ["admin", "sales", "employee", "manager", "developer", "hr"], 
//     default: "employee" 
//   },
//   phone: { 
//     type: String, 
//     required: [true, "Phone number is required"],
//     trim: true 
//   },
//   avatar: { type: String },
//   department: { type: String },
//   employeeId: { 
//     type: String, 
//     required: [true, "Employee ID is required"],
//     unique: true,
//     trim: true,
//     index: true
//   },
//   status: { 
//     type: String, 
//     enum: ["active", "inactive", "on-leave", "terminated"],
//     default: "active" 
//   },
//   position: { type: String },
//   joinDate: { type: Date, default: Date.now },
//   address: {
//     street:  { type: String },
//     city:    { type: String },
//     state:   { type: String },
//     country: { type: String },
//     zip:     { type: String }
//   },
//   permissions: { 
//     type: mongoose.Schema.Types.Mixed,  // Changed from Map to Mixed to avoid validation issues
//     default: {} 
//   },
//   notes: { type: String },
//   isActive: { 
//     type: Boolean, 
//     default: true 
//   },
//   lastLogin: { type: Date },
// }, { 
//   timestamps: true 
// });

// // Create compound index for employeeId and email for faster lookups
// userSchema.index({ employeeId: 1, email: 1 });

// // ─── Hash password before saving (FIXED - no next parameter) ─────────────────
// userSchema.pre("save", async function() {
//   // Only hash if password is modified
//   if (!this.isModified("password")) return;
  
//   try {
//     // Check if password is already hashed to avoid double hashing
//     if (!this.password.startsWith('$2')) {
//       const salt = await bcrypt.genSalt(12);
//       this.password = await bcrypt.hash(this.password, salt);
//     }
//   } catch (error) {
//     console.error("Error hashing password:", error);
//     throw error; // Throw error instead of calling next
//   }
// });

// // ─── Compare password ─────────────────────────────────────────────────────────
// userSchema.methods.comparePassword = async function (candidate) {
//   if (!candidate || !this.password) return false;
//   try {
//     return await bcrypt.compare(candidate, this.password);
//   } catch (error) {
//     console.error("Error comparing password:", error);
//     return false;
//   }
// };

// // ─── Strip password from JSON responses ──────────────────────────────────────
// userSchema.methods.toJSON = function () {
//   const obj = this.toObject();
//   delete obj.password;
//   delete obj.__v;
//   return obj;
// };

// export default mongoose.model("User", userSchema);

import mongoose from "mongoose";
import bcrypt    from "bcryptjs";

const addressSchema = new mongoose.Schema(
  {
    street:  String,
    city:    String,
    state:   String,
    country: String,
    zip:     String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, "Name is required"],
      trim:     true,
    },
    email: {
      type:      String,
      required:  [true, "Email is required"],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type:      String,
      required:  [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select:    false,
    },
    role: {
      type:    String,
      enum:    ["admin", "sales", "employee", "manager", "developer", "hr"],
      default: "employee",
    },
    phone: {
      type:     String,
      required: [true, "Phone number is required"],
      trim:     true,
    },
    avatar:     { type: String },
    department: { type: String, trim: true },
    employeeId: {
      type:     String,
      required: [true, "Employee ID is required"],
      unique:   true,
      trim:     true,
      index:    true,
    },
    status: {
      type:    String,
      enum:    ["active", "inactive", "on-leave", "terminated"],
      default: "active",
    },
    position: { type: String, trim: true },
    joinDate:  { type: Date, default: Date.now },
    address:   { type: addressSchema, default: () => ({}) },
    permissions: {
      type:    mongoose.Schema.Types.Mixed,
      default: {},
    },
    notes:    { type: String },
    isActive: { type: Boolean, default: true, index: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// ─── Compound index for OTP lookups ──────────────────────────────────────────
userSchema.index({ employeeId: 1, email: 1 });

// ─── Hash password before saving ─────────────────────────────────────────────
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// ─── Instance methods ─────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidate) {
  if (!candidate || !this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

export default mongoose.model("User", userSchema);
