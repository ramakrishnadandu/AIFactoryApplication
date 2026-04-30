import express, { Request, Response } from 'express';
import logger from './logger.service';
import {
  createHabit,
  deleteHabit,
  editHabit,
  getHabits,
  getHabitById,
  updateHabit,
} from './habits.service';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!app.get('env') || app.get('env') !== 'production') {
  app.use((req, res, next) => {
    logger.info(`Request method: ${req.method}`);
    logger.info(`Request URL: ${req.url}`);
    logger.info(`Request body: ${JSON.stringify(req.body, null, 2)}`);
    logger.info(`Request headers: ${Object.keys(req.headers).join(', ')}`);
    next();
  });
}

// POST /habits
app.post('/habits', async (req: Request, res: Response) => {
  try {
    const habit = await createHabit(req.body);
    return res.status(201).json(habit);
  } catch (error) {
    logger.error(`Error creating habit: ${error}`);
    return res.status(500).json({ message: 'Failed to create habit' });
  }
});

// GET /habits
app.get('/habits', async (req: Request, res: Response) => {
  try {
    const habits = await getHabits();
    return res.json(habits);
  } catch (error) {
    logger.error(`Error fetching habits: ${error}`);
    return res.status(500).json({ message: 'Failed to fetch habits' });
  }
});

// GET /habits/:id
app.get('/habits/:id', async (req: Request, res: Response) => {
  try {
    const habit = await getHabitById(req.params.id);
    return res.json(habit);
  } catch (error) {
    logger.error(`Error fetching habit by ID: ${error}`);
    return res.status(404).json({ message: 'Habit not found' });
  }
});

// PUT /habits/:id
app.put('/habits/:id', async (req: Request, res: Response) => {
  try {
    const habit = await editHabit(req.params.id, req.body);
    return res.json(habit);
  } catch (error) {
    logger.error(`Error editing habit by ID: ${error}`);
    return res.status(404).json({ message: 'Habit not found' });
  }
});

// DELETE /habits/:id
app.delete('/habits/:id', async (req: Request, res: Response) => {
  try {
    await deleteHabit(req.params.id);
    return res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting habit by ID: ${error}`);
    return res.status(404).json({ message: 'Habit not found' });
  }
});

const port = process.env.PORT || 8002;
app.listen(port, () => {
  console.log(`Habit Service listening on port ${port}`);
});