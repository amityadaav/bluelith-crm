// import express from "express"
// import Lead from "../models/Lead.js"

// const router = express.Router()

// // GET all leads
// router.get("/", async (req,res)=>{

//  const leads = await Lead.find().sort({createdAt:-1})

//  res.json(leads)

// })


// // CREATE lead
// router.post("/", async (req,res)=>{

//  try{

//   const lead = new Lead(req.body)

//   await lead.save()

//   res.json(lead)

//  }catch(error){

//   res.status(500).json({error:error.message})

//  }

// })


// // UPDATE lead
// router.put("/:id", async (req,res)=>{

//  const lead = await Lead.findByIdAndUpdate(
//   req.params.id,
//   req.body,
//   {new:true}
//  )

//  res.json(lead)

// })


// // DELETE lead
// router.delete("/:id", async (req,res)=>{

//  await Lead.findByIdAndDelete(req.params.id)

//  res.json({message:"Lead deleted"})

// })

// export default router

// import { Router }                                                              from "express";
// import { getLeads, createLead, getLeadById, updateLead, deleteLead, convertLead } from "../controllers/leadController.js";
// import { protect, authorize }                                                  from "../middleware/authMiddleware.js";

// const router = Router();
// router.use(protect);

// router.get("/",              getLeads);
// router.post("/",             createLead);
// router.get("/:id",           getLeadById);
// router.put("/:id",           updateLead);
// router.delete("/:id",        authorize("admin", "sales"), deleteLead);
// router.post("/:id/convert",  authorize("admin", "sales"), convertLead);

// export default router;

import { Router } from "express";
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  deleteLead,
  convertLead
} from "../controllers/leadController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();


// 🔓 PUBLIC ROUTE (for website form)
router.post("/", createLead);


// 🔐 PROTECTED ROUTES (for CRM dashboard)
router.get("/", protect, getLeads);
router.get("/:id", protect, getLeadById);
router.put("/:id", protect, updateLead);
router.delete("/:id", protect, authorize("admin", "sales"), deleteLead);
router.post("/:id/convert", protect, authorize("admin", "sales"), convertLead);

export default router;