import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

// Create express app
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err: Error) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Routes
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`User Service is running on port ${PORT}`);
});

// Middleware for handling errors
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`[Error] ${err.message}`);
    res.status(500).json({ error: err.message });
};

// Routes definitions (file: routes/userRoutes.ts)
// Example Route Handlers
import express from 'express';
import { getUsersInterests, addUserInterest } from '../controllers/userController';

const router = express.Router();

// Get user's interests
router.get('/:userId/interests', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const interests = await getUsersInterests(req.params.userId);
        res.json(interests);
    } catch (error) {
        next(error);
    }
});

// Add a new interest
router.post('/:userId/interests', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedInterests = await addUserInterest(req.params.userId, req.body.interest);
        res.status(201).json(updatedInterests);
    } catch (error) {
        next(error);
    }
});

export default router;

// Controllers definitions (file: controllers/userController.ts)
import User from '../models/user';

export const getUsersInterests = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user.interests;
};

export const addUserInterest = async (userId: string, interest: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    user.interests.push(interest);
    await user.save();
    return user.interests;
};