import Project from '../models/project.models.js'
import {ApiError} from '../utils/api-error.js'
import {ApiResponse} from '../utils/api-response.js'

const createProject = async (req,res)=>{
    const {name,description,memebers}=req.body;

    if(!name){
        return res.status(400).json(new ApiError(400, "Project name is required"));
    }

    const createProject=await Project.create({
        name,
        description,
        members,
        owner:req.user_id
    });

    return res.status(201).json(
          new ApiResponse(201, project, "Project created successfully")
    );
}

const getAllProjects = async (req,res)=>{
    const projects = await Project.find({
        $or: [
            { owner: req.user._id },
            { members: req.user._id }
        ]
    })
    .populate('owner','name email')
    .populate('members','name email')
    .sort({createdAt:-1});

    return res.status(200).json(
        new ApiResponse(200, projects, "Projects fetched successfully")
    );
}

const getProjectById  = async (req,res)=>{
    const projectId = req.params.id;

    const project=await Project.findById(projectId)
            .populate('owner','name email')
            .populate('members','name email');

     if (!project) {
        return res.status(404).json(new ApiError(404, "Project not found"));
    }


    const isMember = project.members.some(m => m._id.toString() === req.user._id.toString());
    const isOwner = project.owner._id.toString() === req.user._id.toString();

    if (!isMember && !isOwner) {
        return res.status(403).json(new ApiError(403, "Not authorized"));
    }

    const tasks=await Task.find({
        project:projectId,
        isArchived:false
    })

     return res.status(200).json(
        new ApiResponse(200, { project, tasks }, "Project fetched successfully")
    );

};


const updateProject = async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404).json(new ApiError(404, "Project not found"));
    }

    if (project.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json(new ApiError(403, "Only owner can update project"));
    }

    const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedProject, "Project updated successfully")
    );
};


const deleteProject = async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404).json(new ApiError(404, "Project not found"));
    }

    if (project.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json(new ApiError(403, "Only owner can delete project"));
    }

    await Task.updateMany(
        { project: req.params.id },
        { isArchived: true }
    );

    await Project.findByIdAndDelete(req.params.id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Project deleted successfully")
    );
};

const addMember = async (req, res) => {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404).json(new ApiError(404, "Project not found"));
    }

    if (project.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json(new ApiError(403, "Only owner can add members"));
    }

    if (project.members.includes(userId)) {
        return res.status(400).json(new ApiError(400, "User already a member"));
    }

    project.members.push(userId);
    await project.save();

    return res.status(200).json(
        new ApiResponse(200, project, "Member added successfully")
    );
};

export { createProject, getAllProjects, getProjectById, updateProject, deleteProject, addMember };