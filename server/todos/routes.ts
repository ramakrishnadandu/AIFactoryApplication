import express, { Request, Response, NextFunction } from 'express';
import { Todo } from './models/Todo';
import jwtMiddleware from '../auth/jwtMiddleware';
import mongoose from 'mongoose';

const router = express.Router();

// Error handling middleware
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);

// Get all todos for the authenticated user
router.get('/', jwtMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;

  try {
    const todos = await Todo.find({ userId });
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Unable to fetch todos' });
  }
}));

// Create a new todo
router.post('/', jwtMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { title, description, priority, dueDate } = req.body;
  const userId = req.user.id;

  try {
    const newTodo = new Todo({ userId, title, description, priority, dueDate, completed: false });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Unable to create todo' });
  }
}));

// Update an existing todo
router.put('/:id', jwtMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const todoId = req.params.id;
  const { title, description, priority, dueDate, completed } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(todoId, { title, description, priority, dueDate, completed }, { new: true });

    if (!updatedTodo) {
      res.status(404).json({ error: 'Todo not found' });
    } else {
      res.json(updatedTodo);
    }
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Unable to update todo' });
  }
}));

// Delete a todo
router.delete('/:id', jwtMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const todoId = req.params.id;

  try {
    const deletedTodo = await Todo.findByIdAndDelete(todoId);

    if (!deletedTodo) {
      res.status(404).json({ error: 'Todo not found' });
    } else {
      res.json({ message: 'Todo deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Unable to delete todo' });
  }
}));

export default router;

// Todo Model Definition
const todoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  dueDate: { type: Date, required: false }
});

export const Todo = mongoose.model('Todo', todoSchema);