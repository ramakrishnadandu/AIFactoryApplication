import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { createLogger, format, transports } from 'winston';
import { userRegistrationHandler } from './handlers/userHandlers';
import { errorMiddleware } from './middleware/errorMiddleware';
import { sendConfirmationEmail } from './services/emailService';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Set up Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Logger setup
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
  ),
  transports: [new transports.Console()],
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI!, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error(`Failed to connect to MongoDB: ${err.message}`));

// Middleware
app.use(bodyParser.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Received ${req.method} request for ${req.url}`);
  next();
});

// Routes
app.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userRegistrationHandler(req.body);
    await sendConfirmationEmail(user.email);
    res.status(201).json({ message: 'User registered successfully, confirmation email sent.', user });
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  logger.info(`User Service running on http://localhost:${PORT}`);
});

// handlers/userHandlers.ts
import { Request } from 'express';
import { User } from '../models/user';
import bcrypt from 'bcrypt';

export const userRegistrationHandler = async (userData: Request['body']) => {
  if (!userData.email || !userData.password) {
    throw new Error('Email and password are required');
  }

  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('Email is already registered');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = new User({
    email: userData.email,
    password: hashedPassword,
  });

  return newUser.save();
};

// models/user.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const User = mongoose.model<IUser>('User', UserSchema);

// services/emailService.ts
import nodemailer from 'nodemailer';

export const sendConfirmationEmail = async (email: string) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to our app',
    text: 'Thank you for registering. Please confirm your email address.',
  };

  await transporter.sendMail(mailOptions);
};

// middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: err.message });
};