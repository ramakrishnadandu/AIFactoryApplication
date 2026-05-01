import express from 'express';
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { body, validationResult } from 'express-validator';
import logger from '../utils/logger';

const router = express.Router();

// Setup nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or any other email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Error handling middleware
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: Function) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Registration email confirmation
router.post(
  '/send-registration-email',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('name').isString().withMessage('Name is required'),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error('Validation failed: ', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to SayHi!',
      text: `Hello ${name},\n\nThank you for registering. We're excited to have you on board!\n\nBest regards,\nThe SayHi Team`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      logger.info(`Registration email sent to ${email}: ${info.response}`);
      res.status(200).json({ message: 'Confirmation email sent successfully.' });
    } catch (error) {
      logger.error('Error sending email: ', error);
      res.status(500).json({ error: 'Email sending failed' });
    }
  })
);

// Greeting email
router.post(
  '/send-greeting-email',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('name').isString().withMessage('Name is required'),
    body('occasion').isString().withMessage('Occasion is required'),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error('Validation failed: ', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, occasion } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Greetings from SayHi - Happy ${occasion}!`,
      text: `Hello ${name},\n\nWishing you a very happy ${occasion}!\n\nBest regards,\nThe SayHi Team`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      logger.info(`Greeting email sent to ${email}: ${info.response}`);
      res.status(200).json({ message: 'Greeting email sent successfully.' });
    } catch (error) {
      logger.error('Error sending email: ', error);
      res.status(500).json({ error: 'Email sending failed' });
    }
  })
);

export default router;