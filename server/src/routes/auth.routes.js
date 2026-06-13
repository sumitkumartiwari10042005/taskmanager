import {Router} from 'express';
import { loginUser, registerUser ,logoutUser,getme, refreshAccessToken } from '../controllers/auth.controllers.js';
import { verifyJWT } from '../middleware/auth.middleware.js';


const router= Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout',verifyJWT,logoutUser);
router.get('/getmehaha',verifyJWT,getme);
router.post('/refresh-token',refreshAccessToken)

export default router;