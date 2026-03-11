// const express = require('express');
// const router = express.Router();
// const {
//   getLeads,
//   getLead,
//   createLead,
//   updateLead,
//   deleteLead
// } = require('../controllers/leadController');
// const { protect } = require('../middleware/authMiddleware');

// // All routes are protected
// router.use(protect);

// router.route('/')
//   .get(getLeads)
//   .post(createLead);

// router.route('/:id')
//   .get(getLead)
//   .put(updateLead)
//   .delete(deleteLead);

// module.exports = router;

// import express from "express"
// import {createLead,getLeads} from "../controllers/leadController.js"

// const router = express.Router()

// router.post("/add",createLead)
// router.get("/",getLeads)

// export default router


import express from "express"
import Lead from "../models/Lead.js"

const router = express.Router()

// GET all leads
router.get("/", async (req,res)=>{

 const leads = await Lead.find().sort({createdAt:-1})

 res.json(leads)

})


// CREATE lead
router.post("/", async (req,res)=>{

 try{

  const lead = new Lead(req.body)

  await lead.save()

  res.json(lead)

 }catch(error){

  res.status(500).json({error:error.message})

 }

})


// UPDATE lead
router.put("/:id", async (req,res)=>{

 const lead = await Lead.findByIdAndUpdate(
  req.params.id,
  req.body,
  {new:true}
 )

 res.json(lead)

})


// DELETE lead
router.delete("/:id", async (req,res)=>{

 await Lead.findByIdAndDelete(req.params.id)

 res.json({message:"Lead deleted"})

})

export default router