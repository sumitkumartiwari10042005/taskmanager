import mongoose from "mongoose";

const DB_URL=process.env.MONGODB_URI;

const connectDB = async ()=>{
     try{

         await mongoose.connect(DB_URL);
         console.log("Database connected");

     }catch(error){
        console.log(`Error while connecting to DB: ${error.message}`);
        process.exit(1);
     }
}

export default connectDB;