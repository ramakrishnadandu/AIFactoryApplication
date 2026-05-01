import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import axios from 'axios';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(morgan('dev'));

// Middleware to check for valid JWT token
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Sample data for greetings
const greetings = {
    birthday: "Happy Birthday, ",
    festival: "Happy Festival, ",
    general: "Hello, "
};

// GET endpoint to fetch personalized greetings
app.get('/greet', authenticateToken, (req: Request, res: Response) => {
    const { type, username } = req.query;

    if (!type || !greetings[type as string]) {
        return res.status(400).json({ error: 'Invalid greeting type' });
    }

    const greetingMessage = greetings[type as keyof typeof greetings] + username;
    res.status(200).json({ message: greetingMessage });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
    console.log(`GreetingService is running on port ${PORT}`);
});