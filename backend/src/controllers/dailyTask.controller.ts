import { Request, Response } from 'express';
import { PrismaClient, TaskType } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/daily-tasks/template
export const createDailyTaskTemplate = async (req: Request, res: Response) => {
    const { title } = req.body;
    const task = await prisma.task.create({
        data: {
            title,
            type: TaskType.daily,
            userId: req.user!.id,
        },
    });
    res.status(201).json({ data: task });
};

// GET /api/daily-tasks?date=YYYY-MM-DD
export const getDailyTasksForDate = async (req: Request, res: Response) => {
    const { date } = req.query;
    if (!date || typeof date !== 'string') {
        return res.status(400).json({ message: 'A valid date query parameter is required.' });
    }

    const targetDate = new Date(date);

    // 1. Get all task templates for the user
    const taskTemplates = await prisma.task.findMany({
        where: { userId: req.user!.id, type: TaskType.daily },
    });

    // 2. Get all existing instances for those templates on the target date
    const taskInstances = await prisma.taskInstance.findMany({
        where: {
            userId: req.user!.id,
            date: targetDate,
            taskId: { in: taskTemplates.map(t => t.id) },
        },
    });
    
    // Create a Map for quick lookups of completed statuses
    const instanceMap = new Map(taskInstances.map(i => [i.taskId, i.isCompleted]));

    // 3. Merge them to create the final list for the day
    const dailyTasksState = taskTemplates.map(template => ({
        id: template.id,
        title: template.title,
        isCompleted: instanceMap.get(template.id) || false, // Default to false if no instance exists
    }));

    res.json({ data: dailyTasksState });
};

// POST /api/daily-tasks/log
export const logDailyTask = async (req: Request, res: Response) => {
    const { taskId, date, isCompleted } = req.body;
    const targetDate = new Date(date);

    // Use Prisma's "upsert" to either create a new log or update an existing one.
    // This is perfect for our use case.
    const taskInstance = await prisma.taskInstance.upsert({
        where: {
            // The unique key we defined in the schema
            userId_taskId_date: {
                userId: req.user!.id,
                taskId,
                date: targetDate,
            }
        },
        // If it doesn't exist, create it
        create: {
            isCompleted,
            date: targetDate,
            userId: req.user!.id,
            taskId,
        },
        // If it already exists, update it
        update: {
            isCompleted,
        }
    });

    res.status(200).json({ data: taskInstance });
};