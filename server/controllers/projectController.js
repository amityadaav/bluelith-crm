import Project from "../models/Project.js";

export const getProjects = async(req,res)=>{
  try{
    const projects = await Project.find().sort({createdAt:-1});
    res.json(projects);
  }catch(error){
    res.status(500).json({message:error.message});
  }
};

export const createProject = async(req,res)=>{
  try{

    const remaining = req.body.totalBudget - req.body.paid;

    const project = new Project({
      ...req.body,
      remaining
    });

    const saved = await project.save();

    res.json(saved);

  }catch(error){
    res.status(500).json({message:error.message});
  }
};

export const updateStatus = async(req,res)=>{
  try{

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {status:req.body.status},
      {new:true}
    );

    res.json(project);

  }catch(error){
    res.status(500).json({message:error.message});
  }
};

export const deleteProject = async(req,res)=>{
  try{

    await Project.findByIdAndDelete(req.params.id);
    res.json({message:"Project deleted"});

  }catch(error){
    res.status(500).json({message:error.message});
  }
};

export const addComment = async(req,res)=>{
  try{

    const project = await Project.findById(req.params.id);

    project.comments.push({text:req.body.text});

    await project.save();

    res.json(project);

  }catch(error){
    res.status(500).json({message:error.message});
  }
};