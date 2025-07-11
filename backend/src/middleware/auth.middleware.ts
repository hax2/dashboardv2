import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add a custom property 'user' to the Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    const token = bearer.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Malformed token.' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        req.user = payload;
        next();
    } catch (e) {
        console.error(e);
        return res.status(401).json({ message: 'Invalid token.' });
    }
};