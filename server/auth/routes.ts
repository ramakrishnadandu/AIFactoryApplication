import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './models/User';
import logger from './utils/logger';

// Initialize router
const router = express.Router();

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

// Register route
router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      logger.warn(`User registration failed: ${email} already exists.`);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    user = new User({
      email,
      password_hash: passwordHash,
    });

    await user.save();

    logger.info(`User registered successfully: ${email}`);
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    logger.error(`User registration failed: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Login route
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login failed: ${email} does not exist.`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      logger.warn(`Login failed: Invalid password for ${email}.`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    logger.info(`User logged in successfully: ${email}`);
    res.json({ token });

  } catch (error) {
    logger.error(`Login failed: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Middleware to protect routes
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.body.userId = decoded.userId;
    next();
  } catch (error) {
    logger.error(`Authorization failed: Invalid token.`);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Example of a protected route
router.get('/protected', authMiddleware, (req: Request, res: Response) => {
  res.json({ message: 'This is a protected route' });
});

// Export the router
export default router;