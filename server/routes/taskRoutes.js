// import { Router } from "express";
// import {
//   getMyTasks, getAllTasks, createTask,
//   updateTask, deleteTask, getMyTaskStats,
// } from "../controllers/taskController.js";
// import { protect, authorize } from "../middleware/authMiddleware.js";

// const router = Router();

// router.use(protect); // all task routes require login

// router.get("/my",        getMyTasks);       // employee: my tasks
// router.get("/my/stats",  getMyTaskStats);   // employee: my task stats
// router.get("/",          authorize("admin", "manager"), getAllTasks);  // admin/manager: all tasks
// router.post("/",         authorize("admin", "manager"), createTask);   // admin/manager: create
// router.put("/:id",       updateTask);       // employee: update status | admin: update all
// router.delete("/:id",    authorize("admin", "manager"), deleteTask);   // admin/manager: delete

// export default router;

import { Router } from "express";
import {
  getMyTasks, getMyTaskStats, getAllTasks,
  createTask, updateTask, deleteTask,
} from "../controllers/taskController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);

// Employee routes — order matters: specific before parameterized
router.get("/my",       getMyTasks);
router.get("/my/stats", getMyTaskStats);

// Admin / manager routes
router.get("/",         authorize("admin", "manager"), getAllTasks);
router.post("/",        authorize("admin", "manager"), createTask);

// Mixed — employees can update their own; admins can update any
router.put("/:id",      updateTask);
router.delete("/:id",   authorize("admin", "manager"), deleteTask);

export default router;
