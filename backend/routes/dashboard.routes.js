import express from 'express';
import {
  getDashboardSummary,
  getWeeklyTrend,
  getMonthlyTrend,
  getRecentExpenses,
  getInsights,
  getCalendarTotals,
} from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/summary', protect, getDashboardSummary);
router.get('/weekly-trend', protect, getWeeklyTrend);
router.get('/monthly-trend', protect, getMonthlyTrend);
router.get('/recent-expenses', protect, getRecentExpenses);
router.get('/insights', protect, getInsights);
router.get('/calendar-totals', protect, getCalendarTotals);

export default router;