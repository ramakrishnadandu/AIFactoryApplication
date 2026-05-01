import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, sendConfirmationEmail } from './userModel';
import { User } from './types';
import config from './config';

const app = express();
const PORT = 8000;

app.use(bodyParser.json());

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
};

// User Registration
app.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = await createUser(email, hashedPassword);

    await sendConfirmationEmail(newUser.email);

    res.status(201).json({ message: 'User registered successfully, confirmation email sent.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user.' });
  }
});

// User Login
app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, message: 'Login successful.' });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Error logging in.' });
  }
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`UserService running on http://localhost:${PORT}`);
});

export default app;