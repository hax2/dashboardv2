import { Router } from 'express';
import { getDailyTasksForDate, logDailyTask, createDailyTaskTemplate } from '../controllers/dailyTask.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.use(protect);

// Create a new template (e.g., "Drink water")
router.post('/template', createDailyTaskTemplate);

// Get the state of all daily tasks for a specific date
router.get('/', getDailyTasksForDate);

// Log a task as complete/incomplete for a specific date
router.post('/log', logDailyTask);

export default router;