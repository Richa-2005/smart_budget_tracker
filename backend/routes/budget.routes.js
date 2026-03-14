import express from 'express';
import {
  getBudget,
  postBudget,
  deleteBudget,
} from '../controllers/budget.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:date', protect, getBudget);
router.post('/post/:date', protect, postBudget);
router.delete('/delete', protect, deleteBudget);

export default router;