import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User } from '../models/User';
import { logger } from '../middleware/logger';

const router = express.Router();

// User Registration
router.post(
  '/register',
  body('email').isEmail().withMessage('Please enter a valid email.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // Create new user
      user = new User({
        email,
        password: await bcrypt.hash(password, 10)
      });

      await user.save();

      // Send confirmation email
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: '"SayHi" <no-reply@sayhi.com>',
        to: user.email,
        subject: 'Confirm your email',
        text: 'Thank you for registering! Please confirm your email.'
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return logger.error(`Error sending email: ${error}`);
        }
        logger.info(`Email sent: ${info.response}`);
      });

      res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
      logger.error(`Error in user registration: ${err}`);
      next(err);
    }
  }
);

// User Login
router.post(
  '/login',
  body('email').isEmail().withMessage('Please enter a valid email.'),
  body('password').exists().withMessage('Password is required.'),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Sign JWT
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      logger.error(`Error in user login: ${err}`);
      next(err);
    }
  }
);

export default router;