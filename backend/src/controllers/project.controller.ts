import { Request, Response } from 'express';
import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/projects?status=active
export const getProjects = async (req: Request, res: Response) => {
    const status = req.query.status as Status || 'active';
    const projects = await prisma.project.findMany({
        where: {
            userId: req.user!.id,
            status: status,
        },
        orderBy: { createdAt: 'desc' },
        include: { tasks: true } // Include subtasks
    });
    res.json({ data: projects });
};

export const createProject = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const project = await prisma.project.create({
        data: {
            title,
            description,
            userId: req.user!.id,
        }
    });
    res.status(201).json({ data: project });
};

// PATCH /api/projects/:id/status
export const updateProjectStatus = async (req: Request, res: Response) => {
    const { status } = req.body; // 'completed' or 'archived'
    const updatedProject = await prisma.project.update({
        where: { id: req.params.id },
        data: { status }
    });
    res.json({ data: updatedProject });
};

// DELETE /api/projects/:id
export const deleteProject = async (req: Request, res: Response) => {
    // Thanks to `onDelete: Cascade` in schema.prisma, deleting the project
    // will automatically delete all its associated tasks.
    const deletedProject = await prisma.project.delete({
        where: {
            id: req.params.id,
            // Extra check to make sure user can only delete their own projects
            userId: req.user!.id
        }
    });
    res.json({ data: deletedProject });
};