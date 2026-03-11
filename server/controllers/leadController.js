// const Lead = require('../models/Lead');

// // @desc    Get all leads
// // @route   GET /api/leads
// const getLeads = async (req, res) => {
//   try {
//     const leads = await Lead.find({ createdBy: req.user.id })
//       .sort({ createdAt: -1 });
//     res.json({
//       success: true,
//       count: leads.length,
//       data: leads
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false,
//       message: error.message 
//     });
//   }
// };

// // @desc    Get single lead
// // @route   GET /api/leads/:id
// const getLead = async (req, res) => {
//   try {
//     const lead = await Lead.findById(req.params.id);
    
//     if (!lead) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Lead not found' 
//       });
//     }
    
//     // Check ownership
//     if (lead.createdBy.toString() !== req.user.id) {
//       return res.status(403).json({ 
//         success: false,
//         message: 'Not authorized to access this lead' 
//       });
//     }
    
//     res.json({
//       success: true,
//       data: lead
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false,
//       message: error.message 
//     });
//   }
// };

// // @desc    Create lead
// // @route   POST /api/leads
// const createLead = async (req, res) => {
//   try {
//     const { name, email, phone, company, status, notes } = req.body;
    
//     const lead = await Lead.create({
//       name,
//       email,
//       phone,
//       company,
//       status,
//       notes,
//       createdBy: req.user.id
//     });
    
//     res.status(201).json({
//       success: true,
//       data: lead
//     });
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       const messages = Object.values(error.errors).map(val => val.message);
//       return res.status(400).json({
//         success: false,
//         message: messages.join(', ')
//       });
//     }
//     res.status(500).json({ 
//       success: false,
//       message: error.message 
//     });
//   }
// };

// // @desc    Update lead
// // @route   PUT /api/leads/:id
// const updateLead = async (req, res) => {
//   try {
//     let lead = await Lead.findById(req.params.id);
    
//     if (!lead) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Lead not found' 
//       });
//     }
    
//     // Check ownership
//     if (lead.createdBy.toString() !== req.user.id) {
//       return res.status(403).json({ 
//         success: false,
//         message: 'Not authorized to update this lead' 
//       });
//     }
    
//     lead = await Lead.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
    
//     res.json({
//       success: true,
//       data: lead
//     });
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       const messages = Object.values(error.errors).map(val => val.message);
//       return res.status(400).json({
//         success: false,
//         message: messages.join(', ')
//       });
//     }
//     res.status(500).json({ 
//       success: false,
//       message: error.message 
//     });
//   }
// };

// // @desc    Delete lead
// // @route   DELETE /api/leads/:id
// const deleteLead = async (req, res) => {
//   try {
//     const lead = await Lead.findById(req.params.id);
    
//     if (!lead) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Lead not found' 
//       });
//     }
    
//     // Check ownership
//     if (lead.createdBy.toString() !== req.user.id) {
//       return res.status(403).json({ 
//         success: false,
//         message: 'Not authorized to delete this lead' 
//       });
//     }
    
//     await lead.deleteOne();
    
//     res.json({
//       success: true,
//       message: 'Lead removed successfully'
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false,
//       message: error.message 
//     });
//   }
// };

// module.exports = {
//   getLeads,
//   getLead,
//   createLead,
//   updateLead,
//   deleteLead
// };

import Lead from "../models/Lead.js"

export const createLead = async(req,res)=>{

try{

const lead = new Lead(req.body)

await lead.save()

res.status(201).json(lead)

}catch(error){

res.status(500).json(error)

}

}

export const getLeads = async(req,res)=>{

try{

const leads = await Lead.find()

res.json(leads)

}catch(error){

res.status(500).json(error)

}

}