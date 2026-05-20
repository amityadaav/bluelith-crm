
// import { Router }                    from "express";
// import { Notification }             from "../models/Notification.js";
// import { protect }                  from "../middleware/authMiddleware.js";

// const router = Router();
// router.use(protect);

// // GET /api/notifications
// router.get("/", async (req, res, next) => {
//   try {
//     const filter = { recipient: req.user._id };
//     if (req.query.unread === "true") filter.isRead = false;
//     const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(20);
//     res.json(notifications);
//   } catch (error) { next(error); }
// });

// // PUT /api/notifications/read-all  (must be before /:id/read)
// router.put("/read-all", async (req, res, next) => {
//   try {
//     await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
//     res.json({ success: true, message: "All notifications marked as read." });
//   } catch (error) { next(error); }
// });

// // PUT /api/notifications/:id/read
// router.put("/:id/read", async (req, res, next) => {
//   try {
//     const notification = await Notification.findOneAndUpdate(
//       { _id: req.params.id, recipient: req.user._id },
//       { isRead: true },
//       { new: true }
//     );
//     if (!notification) return res.status(404).json({ message: "Notification not found." });
//     res.json({ success: true, notification });
//   } catch (error) { next(error); }
// });

// export default router;

import { Router }        from "express";
import { Notification }  from "../models/Notification.js";
import { protect }       from "../middleware/authMiddleware.js";
import AppError          from "../utils/AppError.js";
import asyncHandler      from "../utils/asyncHandler.js";

const router = Router();
router.use(protect);

// GET /api/notifications
router.get("/", asyncHandler(async (req, res) => {
  const filter = { recipient: req.user._id };
  if (req.query.unread === "true") filter.isRead = false;

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .limit(20);

  res.json({ success: true, count: notifications.length, notifications });
}));

// PUT /api/notifications/read-all  — must be declared before /:id/read
router.put("/read-all", asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true }
  );
  res.json({ success: true, message: "All notifications marked as read." });
}));

// PUT /api/notifications/:id/read
router.put("/:id/read", asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new AppError("Notification not found.", 404);
  res.json({ success: true, notification });
}));

// DELETE /api/notifications/:id
router.delete("/:id", asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    recipient: req.user._id,
  });
  if (!notification) throw new AppError("Notification not found.", 404);
  res.json({ success: true, message: "Notification deleted." });
}));

export default router;
