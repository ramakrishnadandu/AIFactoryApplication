import express, { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';
import { body, validationResult } from 'express-validator';
import { Logger } from '../utils/logger';

const emailRouter = express.Router();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Handle sending confirmation email
emailRouter.post('/send-confirmation', [
  body('email').isEmail(), // Validate email
  body('username').not().isEmpty().trim().escape() // Basic check on username
], async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    Logger.error(`Validation errors: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, username } = req.body;

  try {
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to SayHi!',
      text: `Hello, ${username}! Welcome to SayHi. Enjoy our services.`
    };

    const info = await transporter.sendMail(mailOptions);
    Logger.info(`Confirmation email sent: ${info.response}`);

    res.status(200).json({ message: 'Confirmation email sent successfully.' });
  } catch (error) {
    Logger.error(`Failed to send confirmation email: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Handle sending greeting emails
emailRouter.post('/send-greeting', [
  body('email').isEmail(), // Validate email
  body('greetingMessage').not().isEmpty().trim().escape() // Validate message
], async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    Logger.error(`Validation errors: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, greetingMessage } = req.body;

  try {
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Special Greeting from SayHi!',
      text: greetingMessage
    };

    const info = await transporter.sendMail(mailOptions);
    Logger.info(`Greeting email sent: ${info.response}`);

    res.status(200).json({ message: 'Greeting email sent successfully.' });
  } catch (error) {
    Logger.error(`Failed to send greeting email: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default emailRouter;