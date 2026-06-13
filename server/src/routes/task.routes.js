import { Router } from 'express'
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask } from '../controllers/task.controllers.js'
import { verifyJWT } from '../middleware/auth.middleware.js'

const router = Router();

router.use(verifyJWT);

router.post('/', createTask);
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;