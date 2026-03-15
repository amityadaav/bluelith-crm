// const User = require("../models/User");


// // Get logged in user
// exports.getProfile = async (req, res) => {

//   try {

//     const user = await User.findById(req.user.id).select("-password");

//     res.json(user);

//   } catch (error) {

//     res.status(500).json({ message: "Server error" });

//   }

// };

import User from "../models/User.js";

export const getUsers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.role)     filter.role     = req.query.role;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === "true";
    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) { next(error); }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) { next(error); }
};

export const updateUser = async (req, res, next) => {
  try {
    const allowed = ["name", "phone", "department", "role", "isActive", "avatar"];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ success: true, user });
  } catch (error) { next(error); }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ message: "You cannot deactivate your own account." });
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ success: true, message: "User deactivated.", user });
  } catch (error) { next(error); }
};