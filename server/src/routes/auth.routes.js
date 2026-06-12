import {Router} from 'express';
import { loginUser, registerUser ,logoutUser,getme } from '../controllers/auth.controllers.js';


const router= Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout',logoutUser);
router.get('/getmehaha',getme);

export default router;