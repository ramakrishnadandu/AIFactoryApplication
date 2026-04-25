import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Todo } from './models/todo';
import { authMiddleware } from './middleware/authMiddleware';

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/todotoday', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware for error handling
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
};

// GET /api/todos - Retrieve all todos for a user
app.get('/api/todos', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const todos = await Todo.find({ userId });
        res.status(200).json(todos);
    } catch (error) {
        console.error('Error retrieving todos:', error);
        res.status(500).json({ message: 'Failed to retrieve todos' });
    }
});

// POST /api/todos - Create a new todo
app.post('/api/todos', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { title, description, priority, dueDate } = req.body;
        if (!title || !priority) {
            return res.status(400).json({ message: 'Title and Priority cannot be empty' });
        }

        const newTodo = new Todo({
            userId: req.user.id,
            title,
            description,
            priority,
            dueDate,
            completed: false,
        });

        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ message: 'Failed to create todo' });
    }
});

// PUT /api/todos/:id - Update a todo
app.put('/api/todos/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const todoId = req.params.id;
        const { title, description, priority, dueDate, completed } = req.body;
        const updatedTodo = await Todo.findByIdAndUpdate(
            todoId,
            { title, description, priority, dueDate, completed },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json(updatedTodo);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ message: 'Failed to update todo' });
    }
});

// DELETE /api/todos/:id - Delete a todo
app.delete('/api/todos/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const todoId = req.params.id;
        const deletedTodo = await Todo.findByIdAndDelete(todoId);

        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ message: 'Failed to delete todo' });
    }
});

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Todo Service running on port ${PORT}`);
}); 

// ./models/todo.ts
import { Schema, Document, model } from 'mongoose';

interface ITodo extends Document {
    userId: string;
    title: string;
    description: string;
    completed: boolean;
    priority: 'Low' | 'Medium' | 'High';
    dueDate: Date;
}

const todoSchema = new Schema<ITodo>({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    priority: { type: String, required: true, enum: ['Low', 'Medium', 'High'] },
    dueDate: { type: Date },
});

export const Todo = model<ITodo>('Todo', todoSchema);

// ./middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};