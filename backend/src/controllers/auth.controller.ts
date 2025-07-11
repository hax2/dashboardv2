import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const createJWT = (user: { id: string }) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
};

export const signup = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    const passwordHash = await bcrypt.hash(password, 5);
    try {
        const user = await prisma.user.create({ data: { email, passwordHash } });
        const token = createJWT(user);
        res.status(201).json({ token });
    } catch (e) {
        res.status(400).json({ message: 'User already exists.' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = createJWT(user);
    res.status(200).json({ token });
};