import mongoose, {Schema} from  'mongoose'

const taskSchema=new Schema({
    title:{
        type:String,
        required:[true,'Title is required'],
        trim:true,
        maxlength:100,
    },
    description:{
        type:String,
        default:'',
        trim:true,
        maxlength:500,
    },
    status:{
        type:String,
        enum:['todo','in-progress','completed'],
        default:'todo',
    },
    priority:{
        type:String,
        enum:['low','medium','high'],
        default:'medium',
    },
    dueDate:{
        type:Date,
        default:null,
    },
    tags:[{
        type:String,
        trim:true,
    }],
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null,
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
        default:null,
    },
    isArchived:{
        type:Boolean,
        default:false,
    }
},{timestamps:true});

const Task=mongoose.model('Task',taskSchema);

export default Task;