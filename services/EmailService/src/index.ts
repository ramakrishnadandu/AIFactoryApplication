import express, { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';
import { json } from 'body-parser';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.EMAIL_SERVICE_PORT || 8002;

// Middleware
app.use(json());

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Internal Server Error' });
};

// Create mail transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper function to send email
const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    let info = await transporter.sendMail({
      from: `"SayHi App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    throw error;
  }
};

// Routes
app.post('/send-confirmation', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ error: 'Email is required' });
  }

  try {
    await sendEmail(email, 'Welcome to SayHi!', 'Thank you for registering with SayHi!');
    res.status(200).send({ message: 'Confirmation email sent successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to send confirmation email' });
  }
});

app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Email Service is running on port ${PORT}`);
});

export default app;