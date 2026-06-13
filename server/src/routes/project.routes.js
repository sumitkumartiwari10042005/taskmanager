import { Router } from "express";
import { createProject,getAllProjects,getProjectById,deleteProject,updateProject,addMember } from "../controllers/project.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router =Router();

router.use(verifyJWT);

router.post('/',createProject);
router.get('/',getAllProjects);
router.get('/:id',getProjectById);
router.delete('/:id',deleteProject);
router.put('/:id',updateProject);
router.post('/:id/members',addMember);

export default router;