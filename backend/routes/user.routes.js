import express from 'express'
import { getUser,registerUser,deleteUser } from '../controllers/user.contollers.js';
const router = express.Router()

router.get('/:username',getUser)

router.post('/post',registerUser)

router.delete('/deleteAccount',deleteUser)

export default router;