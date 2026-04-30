import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Client } from 'pg';
import { config as dotenvConfig } from 'dotenv';
import morgan from 'morgan';

// Initialize environment variables
dotenvConfig();

// Set up PostgreSQL client
const client = new Client({
  connectionString: process.env.DATABASE_URL
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error', err.stack));

// Initialize Express app
const app: Application = express();
const port = process.env.PORT || 8002;

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));

// Types for habit
type Habit = {
  id: number;
  user_id: number;
  title: string;
  description: string;
  created_at: Date;
}

// Add a new habit
app.post('/habits', async (req: Request, res: Response) => {
  const { user_id, title, description }: { user_id: number; title: string; description: string; } = req.body;

  try {
    const result = await client.query(
      'INSERT INTO habits(user_id, title, description, created_at) VALUES($1, $2, $3, NOW()) RETURNING *',
      [user_id, title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting new habit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit an existing habit
app.put('/habits/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description }: { title: string; description: string; } = req.body;

  try {
    const result = await client.query(
      'UPDATE habits SET title = $1, description = $2 WHERE id = $3 RETURNING *',
      [title, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating habit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a habit
app.delete('/habits/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await client.query('DELETE FROM habits WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get list of habits for a specific user
app.get('/habits', async (req: Request, res: Response) => {
  const { user_id } = req.query;

  try {
    const result = await client.query('SELECT * FROM habits WHERE user_id = $1', [user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No habits found for this user' });
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Habit Service listening at http://localhost:${port}`);
});