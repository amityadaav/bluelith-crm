// import Project from "../models/Project.js";

// export const getProjects = async(req,res)=>{
//   try{
//     const projects = await Project.find().sort({createdAt:-1});
//     res.json(projects);
//   }catch(error){
//     res.status(500).json({message:error.message});
//   }
// };

// export const createProject = async(req,res)=>{
//   try{

//     const remaining = req.body.totalBudget - req.body.paid;

//     const project = new Project({
//       ...req.body,
//       remaining
//     });

//     const saved = await project.save();

//     res.json(saved);

//   }catch(error){
//     res.status(500).json({message:error.message});
//   }
// };

// export const updateStatus = async(req,res)=>{
//   try{

//     const project = await Project.findByIdAndUpdate(
//       req.params.id,
//       {status:req.body.status},
//       {new:true}
//     );

//     res.json(project);

//   }catch(error){
//     res.status(500).json({message:error.message});
//   }
// };

// export const deleteProject = async(req,res)=>{
//   try{

//     await Project.findByIdAndDelete(req.params.id);
//     res.json({message:"Project deleted"});

//   }catch(error){
//     res.status(500).json({message:error.message});
//   }
// };

// export const addComment = async(req,res)=>{
//   try{

//     const project = await Project.findById(req.params.id);

//     project.comments.push({text:req.body.text});

//     await project.save();

//     res.json(project);

//   }catch(error){
//     res.status(500).json({message:error.message});
//   }
// };

import Project        from "../models/Project.js";
import { Activity }   from "../models/Notification.js";

export const getProjects = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === "employee") filter.assignedTo = req.user._id;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.client) filter.client = req.query.client;
    const projects = await Project.find(filter)
      .populate("client",     "name company email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) { next(error); }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    await Activity.create({ type: "project_created", description: `New project "${project.name}" was created`, user: req.user._id, userName: req.user.name, relatedTo: { model: "Project", id: project._id } });
    res.status(201).json({ success: true, project });
  } catch (error) { next(error); }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("client",     "name company email phone")
      .populate("assignedTo", "name email phone");
    if (!project) return res.status(404).json({ message: "Project not found." });
    res.json(project);
  } catch (error) { next(error); }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found." });
    const wasCompleted = project.status === "completed";
    Object.assign(project, req.body);
    await project.save();
    const type = (!wasCompleted && project.status === "completed") ? "project_completed" : "project_updated";
    await Activity.create({ type, description: type === "project_completed" ? `Project "${project.name}" marked as completed ✅` : `Project "${project.name}" was updated`, user: req.user._id, userName: req.user.name, relatedTo: { model: "Project", id: project._id } });
    res.json({ success: true, project });
  } catch (error) { next(error); }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found." });
    res.json({ success: true, message: "Project deleted." });
  } catch (error) { next(error); }
};

export const recordPayment = async (req, res, next) => {
  try {
    const { amount, milestoneId } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Valid payment amount is required." });
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found." });
    project.paid += amount;
    if (milestoneId) { const ms = project.milestones.id(milestoneId); if (ms) ms.status = "paid"; }
    await project.save();
    await Activity.create({ type: "payment_received", description: `Payment of ₹${amount.toLocaleString("en-IN")} received for "${project.name}"`, user: req.user._id, userName: req.user.name, relatedTo: { model: "Project", id: project._id } });
    res.json({ success: true, project });
  } catch (error) { next(error); }
};