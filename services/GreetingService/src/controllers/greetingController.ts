import { Request, Response } from 'express';
import { UserServiceClient } from './userServiceClient';
import { GreetingService } from '../services/greetingService';
import { logger } from '../utils/logger';

const greetingService = new GreetingService();
const userServiceClient = new UserServiceClient();

export class GreetingController {
  
  public async dynamicGreeting(req: Request, res: Response): Promise<Response> {
    try {
      const { userId, occasion } = req.body;
      
      // Validate request parameters
      if (!userId || !occasion) {
        throw new Error("Invalid parameters. User ID and occasion are required.");
      }

      // Fetch user details from UserService
      const user = await userServiceClient.getUser(userId);
      if (!user) {
        throw new Error("User not found.");
      }

      // Generate dynamic greeting
      const greetingMessage = await greetingService.generateGreeting(user, occasion);
      
      // Respond with the dynamic greeting message
      return res.status(200).json({ message: greetingMessage });
      
    } catch (error) {
      logger.error(`Error generating dynamic greeting: ${error.message}`);
      return res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
  }

  public async handleRegistration(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      // Validate request parameters
      if (!email || !password) {
        throw new Error("Email and password are required.");
      }

      // Register user via UserService
      const registrationResult = await userServiceClient.registerUser(email, password);
      
      // If registration is successful, send confirmation email (delegated to EmailService)
      if (registrationResult.success) {
        await userServiceClient.sendConfirmationEmail(email);
        return res.status(201).json({ message: "User registered successfully, confirmation email sent." });
      } else {
        return res.status(400).json({ error: "Registration failed", message: registrationResult.message });
      }
      
    } catch (error) {
      logger.error(`Error handling registration: ${error.message}`);
      return res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
  }

  public async handleLogin(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      
      // Validate request parameters
      if (!email || !password) {
        throw new Error("Email and password are required.");
      }

      // Authenticate user through UserService
      const loginResult = await userServiceClient.loginUser(email, password);
      
      if (loginResult.success) {
        return res.status(200).json({ message: "Login successful.", token: loginResult.token });
      } else {
        return res.status(401).json({ error: "Authentication failed", message: loginResult.message });
      }

    } catch (error) {
      logger.error(`Error handling login: ${error.message}`);
      return res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
  }
}