// import express from "express";
// import Notification from "../models/Notification.js";

// const router = express.Router();

// router.get("/", async (req,res)=>{

// const notifications = await Notification
// .find()
// .sort({createdAt:-1})
// .limit(5);

// res.json(notifications);

// });

// export default router;


import { Router }                    from "express";
import { Notification }             from "../models/Notification.js";
import { protect }                  from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);

// GET /api/notifications
router.get("/", async (req, res, next) => {
  try {
    const filter = { recipient: req.user._id };
    if (req.query.unread === "true") filter.isRead = false;
    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
  } catch (error) { next(error); }
});

// PUT /api/notifications/read-all  (must be before /:id/read)
router.put("/read-all", async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: "All notifications marked as read." });
  } catch (error) { next(error); }
});

// PUT /api/notifications/:id/read
router.put("/:id/read", async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Notification not found." });
    res.json({ success: true, notification });
  } catch (error) { next(error); }
});

export default router;