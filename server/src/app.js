import express from 'express';
import cors from 'cors' 

import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import tasksRoutes from './routes/task.routes.js';
import { errorHandler } from './middleware/error.handler.js';


const app = express();

app.use(express.json());
app.use(express.json({limit:"16 Kb"}));

app.use(cors({
    origin:process.env.CORS_ORIGIN?.split(",")||"http://localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT","PATCH","DELETE"],
    allowedHeaders:["Content-Type","Authorization"]
}))


app.use('/api/v1/auth/user',authRoutes);
app.use('/api/v1/projects',projectRoutes);
app.use('/api/v1/tasks',tasksRoutes)



app.use(errorHandler);

export default app;