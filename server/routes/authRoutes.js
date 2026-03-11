// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const { protect } = require('../middleware/authMiddleware');

// // @desc    Register user
// // @route   POST /api/auth/register
// router.post('/register', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Validation
//     if (!name || !email || !password) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Please provide all required fields' 
//       });
//     }

//     // Check if user exists
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'User already exists' 
//       });
//     }

//     // Create user
//     const user = await User.create({
//       name,
//       email,
//       password
//     });

//     // Generate token
//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET || 'your-secret-key',
//       { expiresIn: '30d' }
//     );

//     res.status(201).json({
//       success: true,
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false,
//       message: error.message 
//     });
//   }
// });

// // @desc    Login user
// // @route   POST /api/auth/login
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validation
//     if (!email || !password) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Please provide email and password' 
//       });
//     }

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ 
//         success: false,
//         message: 'Invalid credentials' 
//       });
//     }

//     // Check password
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ 
//         success: false,
//         message: 'Invalid credentials' 
//       });
//     }

//     // Generate token
//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET || 'your-secret-key',
//       { expiresIn: '30d' }
//     );

//     res.json({
//       success: true,
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false,
//       message: error.message 
//     });
//   }
// });

// // @desc    Get current user
// // @route   GET /api/auth/me
// router.get('/me', protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     res.json({
//       success: true,
//       user
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false,
//       message: error.message 
//     });
//   }
// });

// module.exports = router;
import express from "express"
import {register,login} from "../controllers/authController.js"

const router = express.Router()

router.post("/register",register)
router.post("/login",login)

export default router