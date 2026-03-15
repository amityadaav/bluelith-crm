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
import mongoose from "mongoose";
import bcrypt    from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name:       { type: String, required: [true, "Name is required"], trim: true },
    email:      { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, "Invalid email"] },
    password:   { type: String, required: [true, "Password is required"], minlength: 6, select: false },
    role:       { type: String, enum: ["admin", "sales", "employee"], default: "employee" },
    phone:      { type: String, trim: true },
    avatar:     { type: String },
    department: { type: String },
    isActive:   { type: Boolean, default: true },
    lastLogin:  { type: Date },
  },
  { timestamps: true }
);

// ─── Hash password before saving ─────────────────────────────────────────────
// Using promise-based approach (no next) — works correctly with Mongoose 7+/8+
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// ─── Compare password ─────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// ─── Strip password from JSON responses ──────────────────────────────────────
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", userSchema);