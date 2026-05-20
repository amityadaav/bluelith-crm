
// import User from "../models/User.js";

// export const getUsers = async (req, res, next) => {
//   try {
//     const filter = {};
//     if (req.query.role)     filter.role     = req.query.role;
//     if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === "true";
//     const users = await User.find(filter).sort({ createdAt: -1 });
//     res.json(users);
//   } catch (error) { next(error); }
// };
// export const createUser = async (req, res, next) => {
//   try {
//     const {
//       name, email, password, role, phone,
//       department, employeeId, status, position,
//       joinDate, address, permissions, notes
//     } = req.body;

//     if (await User.findOne({ email }))
//       return res.status(400).json({ message: "Email already registered." });

//     const user = await User.create({
//       name, email, password, role, phone,
//       department, employeeId, status, position,
//       joinDate, address, permissions, notes,
//       isActive: true
//     });

//     res.status(201).json({ success: true, message: "User created successfully.", user });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getUserById = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: "User not found." });
//     res.json(user);
//   } catch (error) { next(error); }
// };

// export const updateUser = async (req, res, next) => {
//   try {
//     const allowed = ["name", "phone", "department", "role", "isActive", "avatar"];
//     const updates = {};
//     allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
//     const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
//     if (!user) return res.status(404).json({ message: "User not found." });
//     res.json({ success: true, user });
//   } catch (error) { next(error); }
// };

// export const deleteUser = async (req, res, next) => {
//   try {
//     if (req.params.id === req.user._id.toString())
//       return res.status(400).json({ message: "You cannot deactivate your own account." });
//     const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
//     if (!user) return res.status(404).json({ message: "User not found." });
//     res.json({ success: true, message: "User deactivated.", user });
//   } catch (error) { next(error); }
// };

import User       from "../models/User.js";
import AppError   from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role)                    filter.role     = req.query.role;
  if (req.query.department)              filter.department = req.query.department;
  if (req.query.isActive !== undefined)  filter.isActive = req.query.isActive === "true";

  const users = await User.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, users });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError("User not found.", 404);
  res.json({ success: true, user });
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, department, employeeId,
          status, position, joinDate, address, permissions, notes } = req.body;

  if (await User.findOne({ email }))
    throw new AppError("Email already registered.", 400);
  if (await User.findOne({ employeeId }))
    throw new AppError("Employee ID already exists.", 400);

  const user = await User.create({
    name, email, password, role, phone, department, employeeId,
    status, position, joinDate, address, permissions, notes, isActive: true,
  });

  res.status(201).json({ success: true, message: "User created successfully.", user });
});

export const updateUser = asyncHandler(async (req, res) => {
  // Admin can update these fields; password changes go through /change-password
  const ALLOWED = ["name", "phone", "department", "role", "isActive", "avatar",
                   "status", "position", "address", "notes", "permissions"];
  const updates = {};
  ALLOWED.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new:           true,
    runValidators: true,
  });
  if (!user) throw new AppError("User not found.", 404);

  res.json({ success: true, user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString())
    throw new AppError("You cannot deactivate your own account.", 400);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!user) throw new AppError("User not found.", 404);

  res.json({ success: true, message: "User deactivated successfully.", user });
});
