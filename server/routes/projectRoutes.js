// import express from "express"
// import { createProject, getProjects } from "../controllers/projectController.js"

// const router = express.Router()

// router.post("/add", createProject)
// router.get("/", getProjects)

// export default router

import express from "express";

import {
  getProjects,
  createProject,
  updateStatus,
  deleteProject,
  addComment
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/",getProjects);

router.post("/",createProject);

router.put("/:id/status",updateStatus);

router.delete("/:id",deleteProject);

router.post("/:id/comment",addComment);

export default router;