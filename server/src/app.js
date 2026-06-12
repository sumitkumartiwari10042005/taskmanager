import express from 'express';

import cors from 'cors' 

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN?.split(",")||"http://localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT","PATCH","DELETE"],
    allowedHeaders:["Content-Type","Authorization"]
}))


export default app;