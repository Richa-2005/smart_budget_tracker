import express from 'express'
import {getBudget,postBudget,deleteBudget} from '../controllers/budget.controller.js'
const router = express.Router()

router.get('/:userId/:date',getBudget)

router.post('/post/:userId/:date',postBudget)

router.delete('/delete',deleteBudget)

export default router;