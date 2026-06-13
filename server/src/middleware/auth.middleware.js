import jwt from 'jsonwebtoken'
import  User from '../models/user.models.js'
import { ApiError } from '../utils/api-error.js'

export const verifyJWT = async (req,res,next)=>{
    try{
        const token = req.cookies?.accessToken ||
                      req.headers['authorization']?.replace('Bearer ','');
        
        if (!token) {
            return res.status(401).json(new ApiError(401, "Unauthorized - No token provided"))
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded._id).select('-password -refreshToken')

         if (!user) {
            return res.status(401).json(new ApiError(401, "Unauthorized - Invalid token"))
        }
        
        req.user=user;
        next();

    }catch(error){
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json(new ApiError(401, "Token expired"))
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json(new ApiError(401, "Invalid token"))
        }

        return res.status(500).json(new ApiError(500, "Something went wrong"))
    }
};