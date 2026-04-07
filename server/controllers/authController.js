// import User from "../models/User.js"
// import bcrypt from "bcryptjs"
// import jwt from "jsonwebtoken"

// export const register = async (req,res)=>{

//  try{

//   const {name,email,password,role} = req.body

//   const hashedPassword = await bcrypt.hash(password,10)

//   const user = new User({
//     name,
//     email,
//     password:hashedPassword,
//     role
//   })

//   await user.save()

//   res.json({
//     success:true,
//     message:"User registered successfully",
//     user
//   })

//  }catch(error){

//   res.status(500).json({
//     success:false,
//     error:error.message
//   })

//  }

// }

// export const login = async (req,res)=>{

//  try{

//   const {email,password} = req.body

//   const user = await User.findOne({email})

//   if(!user){
//     return res.status(400).json({
//       success:false,
//       error:"User not found"
//     })
//   }

//   const isMatch = await bcrypt.compare(password,user.password)

//   if(!isMatch){
//     return res.status(400).json({
//       success:false,
//       error:"Invalid password"
//     })
//   }

//   const token = jwt.sign(
//     {id:user._id},
//     process.env.JWT_SECRET,
//     {expiresIn:"7d"}
//   )

//   res.json({
//     success:true,
//     token,
//     user
//   })

//  }catch(error){

//   res.status(500).json({
//     success:false,
//     error:error.message
//   })

//  }

// }

// import jwt            from "jsonwebtoken";
// import User           from "../models/User.js";
// import { Activity }   from "../models/Notification.js";

// const generateToken = (id) =>
//   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "7d" });

// // export const register = async (req, res, next) => {
// //   try {
// //     const { name, email, password, role, phone, department } = req.body;
// //     if (await User.findOne({ email }))
// //       return res.status(400).json({ message: "Email already registered." });

// //     const user = await User.create({ name, email, password, role, phone, department });
// //     await Activity.create({ type: "user_login", description: `New user "${name}" (${role}) created by ${req.user.name}`, user: req.user._id, userName: req.user.name, relatedTo: { model: "User", id: user._id } });

// //     res.status(201).json({ success: true, message: "User created successfully.", user });
// //   } catch (error) { next(error); }
// // };
// export const register = async (req, res, next) => {
//   try {
//     console.log(req.body); // 🔥 debug

//     const {
//       name,
//       email,
//       password,
//       role,
//       phone,
//       department,
//       employeeId,
//       status,
//       position,
//       joinDate,
//       address,
//       permissions,
//       notes
//     } = req.body;

//     // ❗ check existing user
//     if (await User.findOne({ email })) {
//       return res.status(400).json({ message: "Email already registered." });
//     }

//     const user = await User.create({
//   name,
//   email,
//   password,
//   role,
//   phone,
//   department,
//   employeeId,
//   status,
//   position,
//   joinDate,
//   address,
//   permissions,
//   notes,

//   isActive: true // 🔥 ADD THIS
//     });

//     await Activity.create({
//       type: "user_create",
//       description: `New user "${name}" (${role}) created by ${req.user.name}`,
//       user: req.user._id,
//       userName: req.user.name,
//       relatedTo: { model: "User", id: user._id }
//     });

//     res.status(201).json({
//       success: true,
//       message: "User created successfully.",
//       user
//     });

//   } catch (error) {
//     next(error);
//   }
// };

// export const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password)
//       return res.status(400).json({ message: "Email and password are required." });

//     const user = await User.findOne({ email }).select("+password");
//     if (!user || !(await user.comparePassword(password)))
//       return res.status(401).json({ message: "Invalid email or password." });
//     if (!user.isActive)
//       return res.status(403).json({ message: "Account is deactivated. Contact admin." });

//     user.lastLogin = new Date();
//     await user.save({ validateBeforeSave: false });

//     res.json({ success: true, token: generateToken(user._id), user: user.toJSON() });
//   } catch (error) { next(error); }
// };

// export const getMe = async (req, res) => {
//   res.json({ success: true, user: req.user });
// };

// export const updateMe = async (req, res, next) => {
//   try {
//     const allowed = ["name", "phone", "department", "avatar"];
//     const updates = {};
//     allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
//     const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
//     res.json({ success: true, user });
//   } catch (error) { next(error); }
// };

// export const changePassword = async (req, res, next) => {
//   try {
//     const { currentPassword, newPassword } = req.body;
//     if (!currentPassword || !newPassword)
//       return res.status(400).json({ message: "Both passwords are required." });

//     const user = await User.findById(req.user._id).select("+password");
//     if (!(await user.comparePassword(currentPassword)))
//       return res.status(401).json({ message: "Current password is incorrect." });

//     user.password = newPassword;
//     await user.save();
//     res.json({ success: true, message: "Password updated successfully." });
//   } catch (error) { next(error); }
// };


// import jwt            from "jsonwebtoken";
// import User           from "../models/User.js";
// import { Activity }   from "../models/Notification.js";
// import bcrypt from "bcryptjs";
// const otpStore = {}; // ⚠️ production me Redis use karo

// const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// const generateToken = (id) =>
//   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "7d" });

// export const register = async (req, res, next) => {
//   try {
//     console.log(req.body); // 🔥 debug
//     const {
//       name,
//       email,
//       password,
//       role,
//       phone,
//       department,
//       employeeId,
//       status,
//       position,
//       joinDate,
//       address,
//       permissions,
//       notes
//     } = req.body;

//     // ❗ check existing user
//     if (await User.findOne({ email })) {
//       return res.status(400).json({ message: "Email already registered." });
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//       role,
//       phone,
//       department,
//       employeeId,
//       status,
//       position,
//       joinDate,
//       address,
//       permissions,
//       notes,
//       isActive: true
//     });

//     // ✅ Only log activity if req.user exists (admin creating user)
//     if (req.user) {
//       await Activity.create({
//         type: "user_create",
//         description: `New user "${name}" (${role}) created by ${req.user.name}`,
//         user: req.user._id,
//         userName: req.user.name,
//         relatedTo: { model: "User", id: user._id }
//       });
//     }

//     res.status(201).json({
//       success: true,
//       message: "User created successfully.",
//       user
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ message: "Email and password are required." });

//     const user = await User.findOne({ email }).select("+password");

//     if (!user || !(await user.comparePassword(password)))
//       return res.status(401).json({ message: "Invalid email or password." });

//     if (!user.isActive)
//       return res.status(403).json({ message: "Account is deactivated. Contact admin." });

//     user.lastLogin = new Date();
//     await user.save({ validateBeforeSave: false });

//     res.json({
//       success: true,
//       token: generateToken(user._id),
//       user: user.toJSON()
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getMe = async (req, res) => {
//   res.json({ success: true, user: req.user });
// };

// export const updateMe = async (req, res, next) => {
//   try {
//     const allowed = ["name", "phone", "department", "avatar"];
//     const updates = {};
//     allowed.forEach((f) => {
//       if (req.body[f] !== undefined) updates[f] = req.body[f];
//     });

//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       updates,
//       { new: true, runValidators: true }
//     );

//     res.json({ success: true, user });
//   } catch (error) {
//     next(error);
//   }
// };

// export const changePassword = async (req, res, next) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     if (!currentPassword || !newPassword)
//       return res.status(400).json({ message: "Both passwords are required." });

//     const user = await User.findById(req.user._id).select("+password");

//     if (!(await user.comparePassword(currentPassword)))
//       return res.status(401).json({ message: "Current password is incorrect." });

//     user.password = newPassword;
//     await user.save();

//     res.json({ success: true, message: "Password updated successfully." });
//   } catch (error) {
//     next(error);
//   }
// };
// export const verifyEmployeeForReset = async (req, res, next) => {
//   try {
//     const { name, phone, email, employeeId } = req.body;

//     const user = await User.findOne({ name, phone, email, employeeId });

//     if (!user) {
//       return res.status(404).json({ message: "Employee not found." });
//     }

//     const otp = generateOTP();

//     otpStore[email] = {
//       otp,
//       expires: Date.now() + 5 * 60 * 1000, // 5 min
//       attempts: 0
//     };

//     console.log("OTP:", otp); // 👉 later email bhejna

//     res.json({
//       success: true,
//       message: "OTP sent to registered email.",
//       email
//     });

//   } catch (error) {
//     next(error);
//   }
// };

// export const verifyOtp = async (req, res, next) => {
//   try {
//     const { email, otp } = req.body;

//     const record = otpStore[email];

//     if (!record) {
//       return res.status(400).json({ message: "OTP expired." });
//     }

//     if (Date.now() > record.expires) {
//       delete otpStore[email];
//       return res.status(400).json({ message: "OTP expired." });
//     }

//     // 🔐 Attempt limit
//     if (record.attempts >= 3) {
//       delete otpStore[email];
//       return res.status(400).json({ message: "Too many attempts. Try again." });
//     }

//     if (record.otp != otp) {
//       record.attempts += 1;
//       return res.status(400).json({ message: "Invalid OTP." });
//     }

//     // ✅ Verified → mark verified
//     record.verified = true;

//     res.json({
//       success: true,
//       message: "OTP verified successfully."
//     });

//   } catch (error) {
//     next(error);
//   }
// };



// export const resetPasswordWithOtp = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     const record = otpStore[email];

//     if (!record || !record.verified) {
//       return res.status(400).json({ message: "OTP verification required." });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // 🔐 Hash password
//     user.password = await bcrypt.hash(password, 10);
//     await user.save();

//     delete otpStore[email];

//     res.json({
//       success: true,
//       message: "Password reset successfully."
//     });

//   } catch (error) {
//     next(error);
//   }
// };
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { Activity } from "../models/Notification.js";
import bcrypt from "bcryptjs";

// ⚠️ production me Redis use karo
const otpStore = {};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "7d" });

export const register = async (req, res, next) => {
  try {
    console.log(req.body); // 🔥 debug
    const {
      name,
      email,
      password,
      role,
      phone,
      department,
      employeeId,
      status,
      position,
      joinDate,
      address,
      permissions,
      notes
    } = req.body;

    // ❗ check existing user
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      department,
      employeeId,
      status,
      position,
      joinDate,
      address,
      permissions,
      notes,
      isActive: true
    });

    // ✅ Only log activity if req.user exists (admin creating user)
    if (req.user) {
      await Activity.create({
        type: "user_create",
        description: `New user "${name}" (${role}) created by ${req.user.name}`,
        user: req.user._id,
        userName: req.user.name,
        relatedTo: { model: "User", id: user._id }
      });
    }

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      user
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid email or password." });

    if (!user.isActive)
      return res.status(403).json({ message: "Account is deactivated. Contact admin." });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      token: generateToken(user._id),
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

export const updateMe = async (req, res, next) => {
  try {
    const allowed = ["name", "phone", "department", "avatar"];
    const updates = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Both passwords are required." });

    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.comparePassword(currentPassword)))
      return res.status(401).json({ message: "Current password is incorrect." });

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    next(error);
  }
};

// ✅ Step 1 - Verify Employee and Send OTP
export const verifyEmployeeForReset = async (req, res) => {
  try {
    const { name, phone, email, employeeId } = req.body;

    console.log("Verify employee request:", { name, phone, email, employeeId });

    // Validate all fields are present
    if (!name || !phone || !email || !employeeId) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required." 
      });
    }

    // Find user matching ALL criteria
    const user = await User.findOne({ 
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      employeeId: employeeId.trim()
    });

    if (!user) {
      console.log("User not found with criteria:", { name, phone, email, employeeId });
      return res.status(404).json({ 
        success: false,
        message: "Employee not found or details do not match." 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Create unique key using both email and employeeId
    const otpKey = `${employeeId}_${email}`;
    
    otpStore[otpKey] = {
      otp: otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
      attempts: 0,
      verified: false,
      userId: user._id,
      email: email,
      employeeId: employeeId
    };

    console.log("=================================");
    console.log(`🔐 OTP for ${email} (${employeeId}): ${otp}`);
    console.log(`⏰ Valid for 5 minutes`);
    console.log(`OTP Store Key: ${otpKey}`);
    console.log("=================================");

    // TODO: Send email with OTP
    // await sendOTPEmail(email, otp, user.name);

    res.json({
      success: true,
      message: "OTP sent successfully. Check console for OTP.",
      email: email
    });

  } catch (error) {
    console.error("Verify employee error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error. Please try again." 
    });
  }
};

// ✅ Step 2 - Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, employeeId, otp } = req.body;

    console.log("Verify OTP request:", { email, employeeId, otp });

    // Validate required fields
    if (!email || !employeeId || !otp) {
      return res.status(400).json({ 
        success: false,
        message: "Email, Employee ID, and OTP are required." 
      });
    }

    const otpKey = `${employeeId}_${email}`;
    const record = otpStore[otpKey];

    console.log("OTP record:", record);

    // Check if OTP exists
    if (!record) {
      return res.status(400).json({ 
        success: false,
        message: "OTP not found or expired. Please request a new one." 
      });
    }

    // Check if OTP is expired
    if (Date.now() > record.expires) {
      delete otpStore[otpKey];
      return res.status(400).json({ 
        success: false,
        message: "OTP has expired. Please request a new one." 
      });
    }

    // Check attempt limit (max 3 attempts)
    if (record.attempts >= 3) {
      delete otpStore[otpKey];
      return res.status(400).json({ 
        success: false,
        message: "Too many failed attempts. Please request a new OTP." 
      });
    }

    // Verify OTP (convert both to string for comparison)
    if (String(record.otp) !== String(otp)) {
      record.attempts += 1;
      otpStore[otpKey] = record;
      return res.status(400).json({ 
        success: false,
        message: `Invalid OTP. ${3 - record.attempts} attempts remaining.` 
      });
    }

    // ✅ OTP verified successfully
    record.verified = true;
    otpStore[otpKey] = record;

    console.log(`✅ OTP verified for ${email}`);

    res.json({
      success: true,
      message: "OTP verified successfully."
    });

  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error. Please try again." 
    });
  }
};

// ✅ Step 3 - Reset Password with OTP
export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { employeeId, newPassword, otp, email } = req.body;

    console.log("Reset password request received:", { 
      employeeId, 
      email, 
      otp: otp ? "***" : "missing",
      hasPassword: !!newPassword 
    });

    // Validate required fields
    if (!employeeId || !newPassword || !otp || !email) {
      return res.status(400).json({ 
        success: false,
        message: "Employee ID, new password, OTP, and email are required" 
      });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: "Password must be at least 6 characters long" 
      });
    }

    // Verify OTP
    const otpKey = `${employeeId}_${email}`;
    const record = otpStore[otpKey];

    if (!record || !record.verified) {
      return res.status(400).json({ 
        success: false,
        message: "OTP verification required" 
      });
    }

    if (Date.now() > record.expires) {
      delete otpStore[otpKey];
      return res.status(400).json({ 
        success: false,
        message: "OTP has expired" 
      });
    }

    if (String(record.otp) !== String(otp)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid OTP" 
      });
    }

    // Find the user
    const user = await User.findOne({ 
      employeeId: employeeId,
      email: email 
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Set plain password - let the pre-save hook handle hashing
    // DO NOT hash here again - the pre-save hook will do it
    user.password = newPassword;
    await user.save(); // This triggers the pre-save middleware to hash

    console.log(`✅ Password reset successful for ${email} (${employeeId})`);

    // Clear OTP from store
    delete otpStore[otpKey];

    res.json({
      success: true,
      message: "Password reset successfully. Please login with your new password."
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Server error. Please try again." 
    });
  }
};
// Optional: Clean up expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  for (const key in otpStore) {
    if (otpStore[key] && now > otpStore[key].expires) {
      delete otpStore[key];
      console.log(`🗑️ Cleaned up expired OTP for key: ${key}`);
    }
  }
}, 60 * 1000); // Run every minute