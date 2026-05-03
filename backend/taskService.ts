import express, { Request, Response } from 'express';
import { Task } from './models/task';
import { v4 as uuidv4 } from 'uuid';
import { categorizeTasks, breakTasksIntoSteps, createSchedule, identifyRisks, addImprovementHabit, addLearningActivity } from './utils/taskUtils';

const app = express();
app.use(express.json());

let tasks: Task[] = [];

// Create a new task
app.post('/tasks', (req: Request, res: Response) => {
    try {
        const { title, description, deadline, priority } = req.body;

        const newTask: Task = {
            id: uuidv4(),
            title,
            description,
            deadline: deadline ? new Date(deadline) : null,
            priority,
            completed: false
        };

        tasks.push(newTask);
        console.log(`Created new task: ${newTask.title}`);
        return res.status(201).json(newTask);
    } catch (error) {
        console.error('Error creating task:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Retrieve all tasks
app.get('/tasks', (req: Request, res: Response) => {
    try {
        return res.status(200).json(tasks);
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Retrieve a task by ID
app.get('/tasks/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const task = tasks.find(t => t.id === id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        return res.status(200).json(task);
    } catch (error) {
        console.error('Error retrieving task:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a task
app.put('/tasks/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, deadline, priority, completed } = req.body;
        const taskIndex = tasks.findIndex(t => t.id === id);

        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const updatedTask = { ...tasks[taskIndex], title, description, deadline, priority, completed };
        tasks[taskIndex] = updatedTask;

        console.log(`Updated task: ${updatedTask.title}`);
        return res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a task
app.delete('/tasks/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const taskIndex = tasks.findIndex(t => t.id === id);

        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const deletedTask = tasks.splice(taskIndex, 1);
        console.log(`Deleted task: ${deletedTask[0].title}`);
        return res.status(200).json(deletedTask);
    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Categorize tasks
app.post('/tasks/categorize', (req: Request, res: Response) => {
    try {
        const { role, goals, tasksToday, availableTime, energyLevel, priorityAreas, deadlines } = req.body;
        const categorizedTasks = categorizeTasks(tasksToday, goals, priorities);

        const { highPriority, mediumPriority, lowPriority } = categorizedTasks;
        return res.status(200).json({
            highPriority,
            mediumPriority,
            lowPriority
        });
    } catch (error) {
        console.error('Error categorizing tasks:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Generate daily schedule
app.post('/tasks/schedule', (req: Request, res: Response) => {
    try {
        const { tasksToday, availableTime, energyLevel } = req.body;
        
        const actionableSteps = breakTasksIntoSteps(tasksToday);
        const schedule = createSchedule(actionableSteps, availableTime, energyLevel);
        const risks = identifyRisks(actionableSteps);
        const improvementHabit = addImprovementHabit();
        const learningActivity = addLearningActivity();

        return res.status(200).json({
            schedule,
            risks,
            improvementHabit,
            learningActivity,
        });
    } catch (error) {
        console.error('Error generating schedule:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = 8001;
app.listen(PORT, () => {
    console.log(`Task Service running on port ${PORT}`);
});

export {};