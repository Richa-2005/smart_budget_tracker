import express from 'express';
import {
  saveBudgetGoal,
  getBudgetGoal,
} from '../controllers/budgetGoal.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, saveBudgetGoal);
router.get('/', protect, getBudgetGoal);

export default router;