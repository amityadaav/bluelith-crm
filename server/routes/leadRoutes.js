
// import { Router } from "express";
// import {
//   getLeads,
//   createLead,
//   getLeadById,
//   updateLead,
//   deleteLead,
//   convertLead
// } from "../controllers/leadController.js";

// import { protect, authorize } from "../middleware/authMiddleware.js";

// const router = Router();


// // 🔓 PUBLIC ROUTE (for website form)
// router.post("/", createLead);


// // 🔐 PROTECTED ROUTES (for CRM dashboard)
// router.get("/", protect, getLeads);
// router.get("/:id", protect, getLeadById);
// router.put("/:id", protect, updateLead);
// router.delete("/:id", protect, authorize("admin", "sales"), deleteLead);
// router.post("/:id/convert", protect, authorize("admin", "sales"), convertLead);

// export default router;

import { Router } from "express";
import {
  getLeads, createLead, getLeadById,
  updateLead, deleteLead, convertLead,
} from "../controllers/leadController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// Public — website contact form submits here (no auth required)
router.post("/", createLead);

// Protected CRM routes
router.get("/",           protect, getLeads);
router.get("/:id",        protect, getLeadById);
router.put("/:id",        protect, updateLead);
router.delete("/:id",     protect, authorize("admin", "sales"), deleteLead);
router.post("/:id/convert", protect, authorize("admin", "sales"), convertLead);

export default router;
