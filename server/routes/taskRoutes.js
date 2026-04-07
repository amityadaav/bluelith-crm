import { Router } from "express";
import {
  getMyTasks, getAllTasks, createTask,
  updateTask, deleteTask, getMyTaskStats,
} from "../controllers/taskController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect); // all task routes require login

router.get("/my",        getMyTasks);       // employee: my tasks
router.get("/my/stats",  getMyTaskStats);   // employee: my task stats
router.get("/",          authorize("admin", "manager"), getAllTasks);  // admin/manager: all tasks
router.post("/",         authorize("admin", "manager"), createTask);   // admin/manager: create
router.put("/:id",       updateTask);       // employee: update status | admin: update all
router.delete("/:id",    authorize("admin", "manager"), deleteTask);   // admin/manager: delete

export default router;