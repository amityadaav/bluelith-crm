
// import jwt  from "jsonwebtoken";
// import User from "../models/User.js";

// export const protect = async (req, res, next) => {
//   try {
//     let token;
//     if (req.headers.authorization?.startsWith("Bearer ")) {
//       token = req.headers.authorization.split(" ")[1];
//     } else if (req.cookies?.token) {
//       token = req.cookies.token;
//     }

//     if (!token) return res.status(401).json({ message: "Not authorized. No token provided." });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user    = await User.findById(decoded.id).select("-password");

//     if (!user)           return res.status(401).json({ message: "User no longer exists." });
//     if (!user.isActive)  return res.status(403).json({ message: "Account is deactivated. Contact admin." });

//     req.user = user;
//     next();
//   } catch (error) {
//     if (error.name === "JsonWebTokenError") return res.status(401).json({ message: "Invalid token." });
//     if (error.name === "TokenExpiredError") return res.status(401).json({ message: "Token expired. Please login again." });
//     next(error);
//   }
// };

// export const authorize = (...roles) => (req, res, next) => {
//   if (!roles.includes(req.user.role)) {
//     return res.status(403).json({
//       message: `Access denied. Required: ${roles.join(" or ")}. Your role: ${req.user.role}`,
//     });
//   }
//   next();
// };

import jwt  from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

/**
 * protect — verifies JWT from Authorization header or cookie.
 * Attaches the full user document to req.user.
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) return next(new AppError("Not authorized. No token provided.", 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id).select("-password");

    if (!user)          return next(new AppError("User no longer exists.", 401));
    if (!user.isActive) return next(new AppError("Account is deactivated. Contact admin.", 403));

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") return next(new AppError("Invalid token.", 401));
    if (err.name === "TokenExpiredError") return next(new AppError("Token expired. Please login again.", 401));
    next(err);
  }
};

/**
 * authorize — restricts access to specific roles.
 * Must come after protect in the middleware chain.
 *
 * Usage: router.delete("/:id", protect, authorize("admin"), deleteUser)
 */
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError(
        `Access denied. Required role: ${roles.join(" or ")}. Your role: ${req.user.role}`,
        403
      )
    );
  }
  next();
};
