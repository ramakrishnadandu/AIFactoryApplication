import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        console.error('No token provided');
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    try {
        const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            throw new Error('Missing JWT_SECRET_KEY in environment configuration');
        }
        
        const decoded = jwt.verify(token, secretKey) as { id: string };

        req.user = decoded;
        console.info(`Token verified for user: ${decoded.id}`);
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(403).json({ message: 'Access Denied: Invalid token' });
    }
};

export default authMiddleware;