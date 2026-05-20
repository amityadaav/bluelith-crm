
// import Project        from "../models/Project.js";
// import { Activity }   from "../models/Notification.js";

// export const getProjects = async (req, res, next) => {
//   try {
//     const filter = {};
//     if (req.user.role === "employee") filter.assignedTo = req.user._id;
//     if (req.query.status) filter.status = req.query.status;
//     if (req.query.client) filter.client = req.query.client;
//     const projects = await Project.find(filter)
//       .populate("client",     "name company email")
//       .populate("assignedTo", "name email")
//       .sort({ createdAt: -1 });
//     res.json(projects);
//   } catch (error) { next(error); }
// };

// export const createProject = async (req, res, next) => {
//   try {
//     const project = await Project.create(req.body);
//     await Activity.create({ type: "project_created", description: `New project "${project.name}" was created`, user: req.user._id, userName: req.user.name, relatedTo: { model: "Project", id: project._id } });
//     res.status(201).json({ success: true, project });
//   } catch (error) { next(error); }
// };

// export const getProjectById = async (req, res, next) => {
//   try {
//     const project = await Project.findById(req.params.id)
//       .populate("client",     "name company email phone")
//       .populate("assignedTo", "name email phone");
//     if (!project) return res.status(404).json({ message: "Project not found." });
//     res.json(project);
//   } catch (error) { next(error); }
// };

// export const updateProject = async (req, res, next) => {
//   try {
//     const project = await Project.findById(req.params.id);
//     if (!project) return res.status(404).json({ message: "Project not found." });
//     const wasCompleted = project.status === "completed";
//     Object.assign(project, req.body);
//     await project.save();
//     const type = (!wasCompleted && project.status === "completed") ? "project_completed" : "project_updated";
//     await Activity.create({ type, description: type === "project_completed" ? `Project "${project.name}" marked as completed ✅` : `Project "${project.name}" was updated`, user: req.user._id, userName: req.user.name, relatedTo: { model: "Project", id: project._id } });
//     res.json({ success: true, project });
//   } catch (error) { next(error); }
// };

// export const deleteProject = async (req, res, next) => {
//   try {
//     const project = await Project.findByIdAndDelete(req.params.id);
//     if (!project) return res.status(404).json({ message: "Project not found." });
//     res.json({ success: true, message: "Project deleted." });
//   } catch (error) { next(error); }
// };

// export const recordPayment = async (req, res, next) => {
//   try {
//     const { amount, milestoneId } = req.body;
//     if (!amount || amount <= 0) return res.status(400).json({ message: "Valid payment amount is required." });
//     const project = await Project.findById(req.params.id);
//     if (!project) return res.status(404).json({ message: "Project not found." });
//     project.paid += amount;
//     if (milestoneId) { const ms = project.milestones.id(milestoneId); if (ms) ms.status = "paid"; }
//     await project.save();
//     await Activity.create({ type: "payment_received", description: `Payment of ₹${amount.toLocaleString("en-IN")} received for "${project.name}"`, user: req.user._id, userName: req.user.name, relatedTo: { model: "Project", id: project._id } });
//     res.json({ success: true, project });
//   } catch (error) { next(error); }
// };


import Project      from "../models/Project.js";
import { Activity } from "../models/Notification.js";
import AppError     from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getProjects = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === "employee") filter.assignedTo = req.user._id;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.client) filter.client = req.query.client;

  const projects = await Project.find(filter)
    .populate("client",     "name company email")
    .populate("assignedTo", "name email")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: projects.length, projects });
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);

  await Activity.create({
    type:        "project_created",
    description: `New project "${project.name}" was created`,
    user:        req.user._id,
    userName:    req.user.name,
    relatedTo:   { model: "Project", id: project._id },
  });

  res.status(201).json({ success: true, project });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("client",     "name company email phone")
    .populate("assignedTo", "name email phone");

  if (!project) throw new AppError("Project not found.", 404);
  res.json({ success: true, project });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new AppError("Project not found.", 404);

  const wasCompleted = project.status === "completed";
  Object.assign(project, req.body);
  await project.save();

  const isNowCompleted = !wasCompleted && project.status === "completed";
  await Activity.create({
    type:        isNowCompleted ? "project_completed" : "project_updated",
    description: isNowCompleted
      ? `Project "${project.name}" marked as completed ✅`
      : `Project "${project.name}" was updated`,
    user:        req.user._id,
    userName:    req.user.name,
    relatedTo:   { model: "Project", id: project._id },
  });

  res.json({ success: true, project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) throw new AppError("Project not found.", 404);
  res.json({ success: true, message: "Project deleted." });
});

export const recordPayment = asyncHandler(async (req, res) => {
  const { amount, milestoneId } = req.body;

  if (!amount || amount <= 0)
    throw new AppError("A valid payment amount is required.", 400);

  const project = await Project.findById(req.params.id);
  if (!project) throw new AppError("Project not found.", 404);

  if (project.paid + amount > project.totalBudget)
    throw new AppError("Payment exceeds the total project budget.", 400);

  project.paid += amount;

  if (milestoneId) {
    const milestone = project.milestones.id(milestoneId);
    if (milestone) milestone.status = "paid";
  }

  await project.save();

  await Activity.create({
    type:        "payment_received",
    description: `Payment of ₹${amount.toLocaleString("en-IN")} received for "${project.name}"`,
    user:        req.user._id,
    userName:    req.user.name,
    relatedTo:   { model: "Project", id: project._id },
  });

  res.json({ success: true, project });
});
