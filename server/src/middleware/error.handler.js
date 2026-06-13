import { ApiError } from "../utils/api-error.js";

export const errorHandler =(err ,req,res,next)=>{
    let error=err;

    if(!(error instanceof ApiError)){
        const statusCode = error.statusCode || 500
        const message = error.message || "Something went wrong"
        error = new ApiError(statusCode, message, error?.errors || [], err.stack)
    };

    return res.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message,
        errors: error.errors
    })

}