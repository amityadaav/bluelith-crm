
// import express from "express";

// import {
//   getProjects,
//   createProject,
//   updateStatus,
//   deleteProject,
//   addComment
// } from "../controllers/projectController.js";

// const router = express.Router();

// router.get("/",getProjects);

// router.post("/",createProject);

// router.put("/:id/status",updateStatus);

// router.delete("/:id",deleteProject);

// router.post("/:id/comment",addComment);

// export default router;

import { Router }                                                                          from "express";
import { getProjects, createProject, getProjectById, updateProject, deleteProject, recordPayment } from "../controllers/projectController.js";
import { protect, authorize }                                                              from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);

router.get("/",             getProjects);
router.post("/",            authorize("admin", "sales"), createProject);
router.get("/:id",          getProjectById);
router.put("/:id",          authorize("admin", "sales"), updateProject);
router.delete("/:id",       authorize("admin"),          deleteProject);
router.post("/:id/payment", authorize("admin"),          recordPayment);

export default router;