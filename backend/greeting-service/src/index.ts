import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { createLogger, transports, format } from 'winston';

// Initialize Logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'greeting-service.log' })
  ]
});

// Initialize Express App
const app = express();
const PORT = 8001;

// Middleware
app.use(bodyParser.json());

interface User {
  id: string;
  email: string;
}

// In-memory User store (for demo purposes)
const users: User[] = [];

// Dummy send email function (replace with real implementation)
async function sendConfirmationEmail(email: string): Promise<void> {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to SayHi!',
      text: 'Thank you for registering! We hope you enjoy using our service.',
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Confirmation email sent to ${email}`);
  } catch (error) {
    logger.error(`Error sending email: ${error}`);
    throw new Error('Unable to send confirmation email.');
  }
}

// User Registration Route
app.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    const newUser: User = { id: uuidv4(), email };
    users.push(newUser);

    await sendConfirmationEmail(email);
    
    res.status(201).json({ message: 'User registered successfully. Please check your email for confirmation.' });
  } catch (error) {
    logger.error(`Registration error: ${error}`);
    next(error);
  }
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: 'Internal Server Error' });
  logger.error(`Unhandled error: ${err.message}`);
});

// Start server
app.listen(PORT, () => {
  logger.info(`Greeting Service is running on port ${PORT}`);
});