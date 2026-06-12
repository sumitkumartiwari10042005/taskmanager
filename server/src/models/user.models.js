import mongoose, {Schema} from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
        match:[/^\$+@\S+\.\S+$/,'Invalid Email']
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
    isEmailVerified:{
        type:Boolean,
        default:false,
    },
} , {timestamps:true });


userSchema.pre('save',async function(next) {
    if(!this.isModified('password')) return next;
    this.password=await bcrypt.hash(this.password,10);
    next();
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
        _id:this.id,
        email:this.email
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
  )
}

userSchema.methods.generateTemporaryToken=function(){
    const unHashedToken =crypto.randomBytes(20).toString("hex");
    
    const hashedToken =crypto
                          .createHash('sha256')
                          .update(unHashedToken)
                          .digest("hex")
   
    const tokenExpiry=Date.now()+(20*60*1000);

    return {unHashedToken,hashedToken,tokenExpiry};

}

export const User = mongoose.model('User',userSchema);