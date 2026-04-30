import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validateUserInput, validateRegisterInput, validateLoginInput } from './validateInputs';
import { generateToken } from './generateToken';
import { User } from './models/User';
import config from '../config';

const router = express.Router();

// Initialize database connection
let dbConnection: Pool;

async function init() {
  try {
    dbConnection = new Pool({
      user: config.db.user,
      host: config.db.host,
      database: config.db.database,
      password: config.db.password,
      port: config.db.port,
      max: 10,
      min: 0,
    });
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }
}

async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await dbConnection.query('SELECT * FROM users');
    return res.json(users.rows);
  } catch (error) {
    console.error('Failed to retrieve all users:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getUserById(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const user = await dbConnection.query('SELECT * FROM users WHERE id=$1', [userId]);
    if (!user.rows.length) {
      return res.json({ message: 'User not found' });
    }
    return res.json(user.rows[0]);
  } catch (error) {
    console.error('Failed to retrieve user by ID:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function registerUser(req: Request, res: Response) {
  try {
    const { username, email, password } = validateRegisterInput(req.body);
    if (!username || !email || !password) {
      return res.json({ message: 'Invalid request body' });
    }

    const existingUser = await dbConnection.query('SELECT * FROM users WHERE username=$1 OR email=$2', [username, email]);
    if (existingUser.rows.length) {
      return res.json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await dbConnection.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );
    return res.json(user.rows[0]);
  } catch (error) {
    console.error('Failed to register user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function loginUser(req: Request, res: Response) {
  try {
    const { username, password } = validateLoginInput(req.body);
    if (!username || !password) {
      return res.json({ message: 'Invalid request body' });
    }

    const user = await dbConnection.query('SELECT * FROM users WHERE username=$1 OR email=$2', [username, username]);
    if (!user.rows.length) {
      return res.json({ message: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!isValidPassword) {
      return res.json({ message: 'Invalid password' });
    }

    const token = generateToken(user.rows[0]);
    return res.json(token);
  } catch (error) {
    console.error('Failed to login user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function updateProfile(req: Request, res: Response) {
  try {
    const { id, username, email } = req.params;
    if (!id || !username || !email) {
      return res.json({ message: 'Invalid request body' });
    }

    await dbConnection.query('UPDATE users SET username=$1, email=$2 WHERE id=$3', [username, email, id]);
    return res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Failed to update profile:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.json({ message: 'Invalid request body' });
    }

    await dbConnection.query('DELETE FROM users WHERE id=$1', [id]);
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Failed to delete user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

init();

// Route handlers
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile/:id', updateProfile);
router.delete('/delete/user/:id', deleteUser);

export default router;