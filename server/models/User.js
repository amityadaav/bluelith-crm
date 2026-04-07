// import mongoose from "mongoose"

// const UserSchema = new mongoose.Schema({

// name:{
// type:String,
// required:true
// },

// email:{
// type:String,
// required:true,
// unique:true
// },

// password:{
// type:String,
// required:true
// },

// role:{
// type:String,
// default:"admin"
// },

// createdAt:{
// type:Date,
// default:Date.now
// }

// })

// export default mongoose.model("User",UserSchema)
// import mongoose from "mongoose";
// import bcrypt    from "bcryptjs";

// const userSchema = new mongoose.Schema(
//   {
//     name:       { type: String, required: [true, "Name is required"], trim: true },
//     email:      { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, "Invalid email"] },
//     password:   { type: String, required: [true, "Password is required"], minlength: 6, select: false },
//     role:       { type: String, enum: ["admin", "sales", "employee"], default: "employee" },
//     phone:      { type: String, trim: true },
//     avatar:     { type: String },
//     department: { type: String },
//     isActive:   { type: Boolean, default: true },
//     lastLogin:  { type: Date },
//   },
//   { timestamps: true }
// // );
// const userSchema = new mongoose.Schema({
//   name:       { type: String, required: [true, "Name is required"], trim: true },
//   email:      { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
//   password:   { type: String, required: [true, "Password is required"], minlength: 6, select: false },
//   role:       { type: String, enum: ["admin", "sales", "employee"], default: "employee" },
//   phone:      { type: String, trim: true },
//   avatar:     { type: String },
//   department: { type: String },
//   employeeId: { type: String },
//   status:     { type: String },
//   position:   { type: String },
//   joinDate:   { type: Date },
//   address: {
//     street:  { type: String },
//     city:    { type: String },
//     state:   { type: String },
//     country: { type: String },
//     zip:     { type: String }
//   },
//   permissions: { type: Object },
//   notes:       { type: String },
//   isActive:    { type: Boolean, default: true },  // ✅ THIS WAS MISSING
//   lastLogin:   { type: Date },
// }, { timestamps: true });
// // ─── Hash password before saving ─────────────────────────────────────────────
// // Using promise-based approach (no next) — works correctly with Mongoose 7+/8+
// userSchema.pre("save", async function () {
//   if (!this.isModified("password")) return;
//   this.password = await bcrypt.hash(this.password, 12);
// });

// // ─── Compare password ─────────────────────────────────────────────────────────
// userSchema.methods.comparePassword = async function (candidate) {
//   return bcrypt.compare(candidate, this.password);
// };

// // ─── Strip password from JSON responses ──────────────────────────────────────
// userSchema.methods.toJSON = function () {
//   const obj = this.toObject();
//   delete obj.password;
//   return obj;
// };

// export default mongoose.model("User", userSchema);

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
//     index: true  // Add index for faster queries
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
//     type: Map,
//     of: Boolean,
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

// // ─── Hash password before saving ─────────────────────────────────────────────
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
  
//   try {
//     const salt = await bcrypt.genSalt(12);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // ─── Compare password ─────────────────────────────────────────────────────────
// userSchema.methods.comparePassword = async function (candidate) {
//   if (!candidate || !this.password) return false;
//   return bcrypt.compare(candidate, this.password);
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
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Name is required"], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true, 
    lowercase: true, 
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
  },
  password: { 
    type: String, 
    required: [true, "Password is required"], 
    minlength: 6, 
    select: false 
  },
  role: { 
    type: String, 
    enum: ["admin", "sales", "employee", "manager", "developer", "hr"], 
    default: "employee" 
  },
  phone: { 
    type: String, 
    required: [true, "Phone number is required"],
    trim: true 
  },
  avatar: { type: String },
  department: { type: String },
  employeeId: { 
    type: String, 
    required: [true, "Employee ID is required"],
    unique: true,
    trim: true,
    index: true
  },
  status: { 
    type: String, 
    enum: ["active", "inactive", "on-leave", "terminated"],
    default: "active" 
  },
  position: { type: String },
  joinDate: { type: Date, default: Date.now },
  address: {
    street:  { type: String },
    city:    { type: String },
    state:   { type: String },
    country: { type: String },
    zip:     { type: String }
  },
  permissions: { 
    type: mongoose.Schema.Types.Mixed,  // Changed from Map to Mixed to avoid validation issues
    default: {} 
  },
  notes: { type: String },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastLogin: { type: Date },
}, { 
  timestamps: true 
});

// Create compound index for employeeId and email for faster lookups
userSchema.index({ employeeId: 1, email: 1 });

// ─── Hash password before saving (FIXED - no next parameter) ─────────────────
userSchema.pre("save", async function() {
  // Only hash if password is modified
  if (!this.isModified("password")) return;
  
  try {
    // Check if password is already hashed to avoid double hashing
    if (!this.password.startsWith('$2')) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error; // Throw error instead of calling next
  }
});

// ─── Compare password ─────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidate) {
  if (!candidate || !this.password) return false;
  try {
    return await bcrypt.compare(candidate, this.password);
  } catch (error) {
    console.error("Error comparing password:", error);
    return false;
  }
};

// ─── Strip password from JSON responses ──────────────────────────────────────
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

export default mongoose.model("User", userSchema);