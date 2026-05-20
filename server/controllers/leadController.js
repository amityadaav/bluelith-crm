
// import Lead           from "../models/Lead.js";
// import Client         from "../models/Client.js";
// import { Activity }   from "../models/Notification.js";

// const log = (type, desc, userId, userName, leadId) =>
//   Activity.create({ type, description: desc, user: userId, userName, relatedTo: { model: "Lead", id: leadId } });

// export const getLeads = async (req, res, next) => {
//   try {
//     const filter = {};
//     if (req.user.role === "sales") filter.assignedTo = req.user._id;
//     if (req.query.status)     filter.status     = req.query.status;
//     if (req.query.priority)   filter.priority   = req.query.priority;
//     if (req.query.source)     filter.source     = req.query.source;
//     if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
//     if (req.query.startDate || req.query.endDate) {
//       filter.createdAt = {};
//       if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
//       if (req.query.endDate)   filter.createdAt.$lte = new Date(req.query.endDate);
//     }
//     const leads = await Lead.find(filter).populate("assignedTo", "name email").sort({ createdAt: -1 });
//     res.json(leads);
//   } catch (error) { next(error); }
// };

// // export const createLead = async (req, res, next) => {
// //   try {
// //     const lead = await Lead.create({ ...req.body, assignedTo: req.body.assignedTo || req.user._id });
// //     await log("lead_created", `New lead "${lead.name}" was created`, req.user._id, req.user.name, lead._id);
// //     res.status(201).json({ success: true, lead });
// //   } catch (error) { next(error); }
// // };
// export const createLead = async (req, res, next) => {
//   try {
//     const isPublic = !req.user;

//     const lead = await Lead.create({
//       ...req.body,

//       // ✅ Fix assignedTo crash
//       assignedTo: req.body.assignedTo || req.user?._id || null,

//       // ✅ Fix enum issue (must match model exactly)
//       source: req.body.source || (isPublic ? "website" : "other"),

//       // ✅ Optional: normalize fields
//       name: req.body.name,
//       email: req.body.email,
//       phone: req.body.phone,
//       notes: req.body.message || req.body.notes,
//     });

//     // ✅ Only log if CRM user
//     if (req.user) {
//       await log(
//         "lead_created",
//         `New lead "${lead.name}" was created`,
//         req.user._id,
//         req.user.name,
//         lead._id
//       );
//     }

//     res.status(201).json({
//       success: true,
//       lead,
//     });

//   } catch (error) {
//     console.error("❌ ERROR:", error.message);
//     next(error);
//   }
// };

// export const getLeadById = async (req, res, next) => {
//   try {
//     const lead = await Lead.findById(req.params.id).populate("assignedTo", "name email phone");
//     if (!lead) return res.status(404).json({ message: "Lead not found." });
//     res.json(lead);
//   } catch (error) { next(error); }
// };

// export const updateLead = async (req, res, next) => {
//   try {
//     const lead = await Lead.findById(req.params.id);
//     if (!lead) return res.status(404).json({ message: "Lead not found." });
//     const prevStatus = lead.status;
//     Object.assign(lead, req.body);
//     await lead.save();
//     await log("lead_updated", `Lead "${lead.name}" was updated`, req.user._id, req.user.name, lead._id);
//     if (prevStatus !== "won"  && lead.status === "won")
//       await log("lead_won",  `Lead "${lead.name}" was marked as WON 🎉`, req.user._id, req.user.name, lead._id);
//     if (prevStatus !== "lost" && lead.status === "lost")
//       await log("lead_lost", `Lead "${lead.name}" was marked as lost`,   req.user._id, req.user.name, lead._id);
//     res.json({ success: true, lead });
//   } catch (error) { next(error); }
// };

// export const deleteLead = async (req, res, next) => {
//   try {
//     const lead = await Lead.findByIdAndDelete(req.params.id);
//     if (!lead) return res.status(404).json({ message: "Lead not found." });
//     res.json({ success: true, message: "Lead deleted successfully." });
//   } catch (error) { next(error); }
// };

// export const convertLead = async (req, res, next) => {
//   try {
//     const lead = await Lead.findById(req.params.id);
//     if (!lead) return res.status(404).json({ message: "Lead not found." });
//     if (lead.status !== "won")
//       return res.status(400).json({ message: "Only won leads can be converted to clients." });
//     if (await Client.findOne({ email: lead.email }))
//       return res.status(400).json({ message: "A client with this email already exists." });

//     const client = await Client.create({
//       name: lead.name, email: lead.email, phone: lead.phone,
//       company: lead.company || req.body.company || "Unknown",
//       assignedTo: lead.assignedTo, convertedFromLead: lead._id,
//     });
//     await log("client_created", `Lead "${lead.name}" converted to client`, req.user._id, req.user.name, lead._id);
//     res.status(201).json({ success: true, client });
//   } catch (error) { next(error); }
// };

import Lead         from "../models/Lead.js";
import Client       from "../models/Client.js";
import { Activity } from "../models/Notification.js";
import AppError     from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// ─── Helper ───────────────────────────────────────────────────────────────────
const logActivity = (type, description, userId, userName, leadId) =>
  Activity.create({
    type, description,
    user: userId, userName,
    relatedTo: { model: "Lead", id: leadId },
  });

// ─── GET /api/leads ───────────────────────────────────────────────────────────
export const getLeads = asyncHandler(async (req, res) => {
  const filter = {};

  // Sales reps only see their own leads
  if (req.user.role === "sales") filter.assignedTo = req.user._id;

  if (req.query.status)     filter.status     = req.query.status;
  if (req.query.priority)   filter.priority   = req.query.priority;
  if (req.query.source)     filter.source     = req.query.source;
  if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

  if (req.query.startDate || req.query.endDate) {
    filter.createdAt = {};
    if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
    if (req.query.endDate)   filter.createdAt.$lte = new Date(req.query.endDate);
  }

  const leads = await Lead.find(filter)
    .populate("assignedTo", "name email")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: leads.length, leads });
});

// ─── POST /api/leads (also handles public website form submissions) ────────────
export const createLead = asyncHandler(async (req, res) => {
  const lead = await Lead.create({
    name:       req.body.name,
    email:      req.body.email,
    phone:      req.body.phone,
    company:    req.body.company,
    source:     req.body.source || (req.user ? "other" : "website"),
    status:     req.body.status,
    priority:   req.body.priority,
    estimatedValue: req.body.estimatedValue,
    notes:      req.body.message || req.body.notes,
    assignedTo: req.body.assignedTo || req.user?._id || null,
    followUpDate: req.body.followUpDate,
  });

  if (req.user) {
    await logActivity(
      "lead_created",
      `New lead "${lead.name}" was created`,
      req.user._id,
      req.user.name,
      lead._id
    );
  }

  res.status(201).json({ success: true, lead });
});

// ─── GET /api/leads/:id ───────────────────────────────────────────────────────
export const getLeadById = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id).populate("assignedTo", "name email phone");
  if (!lead) throw new AppError("Lead not found.", 404);
  res.json({ success: true, lead });
});

// ─── PUT /api/leads/:id ───────────────────────────────────────────────────────
export const updateLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) throw new AppError("Lead not found.", 404);

  const prevStatus = lead.status;
  Object.assign(lead, req.body);
  await lead.save();

  await logActivity("lead_updated", `Lead "${lead.name}" was updated`, req.user._id, req.user.name, lead._id);

  if (prevStatus !== "won"  && lead.status === "won")
    await logActivity("lead_won",  `Lead "${lead.name}" marked as WON 🎉`, req.user._id, req.user.name, lead._id);
  if (prevStatus !== "lost" && lead.status === "lost")
    await logActivity("lead_lost", `Lead "${lead.name}" marked as lost`,   req.user._id, req.user.name, lead._id);

  res.json({ success: true, lead });
});

// ─── DELETE /api/leads/:id ────────────────────────────────────────────────────
export const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) throw new AppError("Lead not found.", 404);
  res.json({ success: true, message: "Lead deleted successfully." });
});

// ─── POST /api/leads/:id/convert ─────────────────────────────────────────────
export const convertLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) throw new AppError("Lead not found.", 404);

  if (lead.status !== "won")
    throw new AppError("Only leads with status 'won' can be converted to clients.", 400);

  if (await Client.findOne({ email: lead.email }))
    throw new AppError("A client with this email already exists.", 400);

  const client = await Client.create({
    name:              lead.name,
    email:             lead.email,
    phone:             lead.phone,
    company:           lead.company || req.body.company || "Unknown",
    assignedTo:        lead.assignedTo,
    convertedFromLead: lead._id,
  });

  await logActivity(
    "client_created",
    `Lead "${lead.name}" converted to client`,
    req.user._id,
    req.user.name,
    lead._id
  );

  res.status(201).json({ success: true, client });
});
