import express from 'express'
import { getUser,registerUser,deleteUser } from '../controllers/user.contollers'
const router = express.Router()

router.get('/',getUser)

router.post('/post',registerUser)

router.delete('/deleteAccount',deleteUser)

export default router;