import express from 'express';
import {
  getUser,
  registerUser,
  deleteUser,
  loginUser,
} from '../controllers/user.controllers.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUser);
router.delete('/deleteAccount', protect, deleteUser);

export default router;