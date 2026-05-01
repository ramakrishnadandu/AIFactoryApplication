import { Request, Response } from 'express';
import { UserModel } from '../models/UserModel';
import { EmailService } from '../services/EmailService';
import { Logger } from '../utils/logger';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Environment variables or Configurations
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const BCRYPT_SALT_ROUNDS = 10;

class UserController {

  // User Registration
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required.' });
        return;
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: 'User already exists.' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
      const newUser = new UserModel({ email, password: hashedPassword });
      await newUser.save();

      await EmailService.sendConfirmationEmail(email);

      res.status(201).json({ message: 'User registered successfully. Confirmation email sent.' });
    } catch (error) {
      Logger.error('Error during user registration:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }

  // User Login
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required.' });
        return;
      }

      const user = await UserModel.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ message: 'Invalid email or password.' });
        return;
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful.', token });
    } catch (error) {
      Logger.error('Error during user login:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
}

export { UserController };