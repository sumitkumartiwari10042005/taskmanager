import mongoose, {Schema} from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'

const userSchema=new Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        trim:true,
        maxlength:50,
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        trim:true,
        lowercase:true,
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/,'Invalid Email']
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        select:false
    },
    avatar:{
        type:String,
        default:''
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    refreshToken:{
        type:String,
        select:false
    }
} , {timestamps:true });


userSchema.pre('save',async function() {
    if(!this.isModified('password')) return;
    this.password=await bcrypt.hash(this.password,10);
})

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
  )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id:this._id,
        email:this.email
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
  )
}

const User = mongoose.model('User',userSchema);

export default User;