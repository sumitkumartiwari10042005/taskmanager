import Task from '../models/task.models.js'
import { ApiError } from '../utils/api-error.js'
import { ApiResponse } from '../utils/api-response.js'

const createTask=async (req,res)=>{
    const {title ,description,status,priority,
        dueDate,tags,assignedTo,project}= res.body;
    
    if(!title){
         return res.status(400).json(new ApiError(400, "Title is required"));
    }

    const task =await Task.create({
        title,
        description,
        status,
        priority,
        dueDate,
        tags,
        assignedTo,
        project,
        createdBy:req.user._id
    });
   
    return res.status(201).json(
        new ApiResponse(201, task, "Task created successfully")
    );

}


const getAllTasks = async (req,res)=>{
    const {status,priority,tags} =req.query;

    const filter={
        createdBy:req.user._id,
        isArchived:false,
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (tags) filter.tags = { $in: tags.split(',') };

    const tasks = await Task.find(filter)
        .populate('assignedTo', 'name email')
        .populate('project', 'name')
        .sort({ createdAt: -1 });
    
    return res.status(200).json(
        new ApiResponse(200, tasks, "Tasks fetched successfully")
    );

}


const getTaskById= async (req,res)=>{
    const taskId=req.params.id;

    const task=await Task.findByIdAndUpdate(taskId)
           .populate('assignedTo','name  email')
           .populate('project', 'name')


    if (!task) {
        return res.status(404).json(new ApiError(404, "Task not found"));
    }

     if (task.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json(new ApiError(403, "Not authorized"));
    }

     return res.status(200).json(
        new ApiResponse(200, task, "Task fetched successfully")
    );
}


const updateTask =async (req,res)=>{
    const taskId = req.params.id;

    if(!task){
        return res.status(404).json(new ApiError(404, "Task not found"));
    }

    if(task.createdBy.toString()!==req.user._id.toString()){
         return res.status(403).json(new ApiError(403, "Not authorized"));
    }

    const updatedTask=await Task.findByIdAndUpdate(taskId , 
        {$set : req.body},
        {new:true}
    );
    
     return res.status(200).json(
        new ApiResponse(200, updatedTask, "Task updated successfully")
    );
}

const deleteTask=async (req,res)=>{
    const taskId= req.params.id;

    const task = await Task.findById(taskId);

    if(!task){
        return res.status(404).json(new ApiError(404, "Task not found"));
    }

     if (task.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json(new ApiError(403, "Not authorized"));
    }
    
    await Task.findByIdAndUpdate(taskId, { isArchived: true }, { new: true });

    return res.status(200).json(
        new ApiResponse(200, {}, "Task deleted successfully")
    );

};

export {createTask,getAllTasks,getTaskById,deleteTask};