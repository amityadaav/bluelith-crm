import Task from "../models/Task.js";

// ─── Get my tasks (employee sees only their own) ──────────────────────────────
export const getMyTasks = async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    const filter = { assignedTo: req.user._id };
    if (status)   filter.status   = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .populate("assignedBy", "name")
      .populate("project",    "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) { next(error); }
};

// ─── Get all tasks (admin/manager only) ──────────────────────────────────────
export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email role")
      .populate("assignedBy", "name")
      .populate("project",    "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) { next(error); }
};

// ─── Create task (admin/manager assigns to employee) ─────────────────────────
export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate, assignedTo, project, tags } = req.body;

    if (!title || !assignedTo)
      return res.status(400).json({ message: "Title and assignedTo are required." });

    const task = await Task.create({
      title, description, priority, status, dueDate,
      assignedTo, project, tags,
      assignedBy: req.user._id,
    });

    await task.populate(["assignedTo", "assignedBy", "project"]);
    res.status(201).json({ success: true, message: "Task created successfully.", task });
  } catch (error) { next(error); }
};

// ─── Update task ──────────────────────────────────────────────────────────────
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });

    // Employee can only update their own tasks (status only)
    if (req.user.role === "employee" || req.user.role === "developer") {
      if (task.assignedTo.toString() !== req.user._id.toString())
        return res.status(403).json({ message: "Not authorized to update this task." });
      // Employee can only change status
      if (req.body.status) task.status = req.body.status;
    } else {
      // Admin/manager can update everything
      const fields = ["title", "description", "priority", "status", "dueDate", "assignedTo", "project", "tags"];
      fields.forEach(f => { if (req.body[f] !== undefined) task[f] = req.body[f]; });
    }

    await task.save();
    await task.populate(["assignedTo", "assignedBy", "project"]);
    res.json({ success: true, message: "Task updated.", task });
  } catch (error) { next(error); }
};

// ─── Delete task (admin only) ─────────────────────────────────────────────────
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });
    res.json({ success: true, message: "Task deleted." });
  } catch (error) { next(error); }
};

// ─── Get task stats for dashboard ────────────────────────────────────────────
export const getMyTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [total, pending, inProgress, completed] = await Promise.all([
      Task.countDocuments({ assignedTo: userId }),
      Task.countDocuments({ assignedTo: userId, status: "pending" }),
      Task.countDocuments({ assignedTo: userId, status: "in-progress" }),
      Task.countDocuments({ assignedTo: userId, status: "completed" }),
    ]);
    res.json({ success: true, stats: { total, pending, inProgress, completed } });
  } catch (error) { next(error); }
};