import mongoose, {Schema} from 'mongoose';

const projectSchema=new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        maclength:80,
    },
    description:{
        type:String,
        default:'',
        maxlength:300,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    members:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:'User',
    }],
},{timestamps:true});

const Project=mongoose.model('Project',projectSchema);

export default Project;