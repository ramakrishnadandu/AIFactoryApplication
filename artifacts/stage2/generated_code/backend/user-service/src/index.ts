import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandlers';
import logger from './utils/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 8001;

// Middleware setup
app.use(morgan('combined', { stream: logger.stream }));
app.use(helmet()); // Basic security
app.use(cors()); // Enable CORS
app.use(express.json());

// Route setup
app.use('/api/users', userRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  logger.info(`User Service running on port ${port}`);
});

// Middleware for logging requests
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.debug(`HTTP ${req.method} ${req.url}`);
  next();
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Received SIGINT. Shutting down gracefully');
  process.exit(0);
});

// Middleware definitions
app.use((req, res, next) => {
  logger.info(`Request IP: ${req.ip}`);
  next();
});

export default app;

// File: src/routes/userRoutes.ts
import { Router } from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getUserProfile);

export default router;

// File: src/middleware/errorHandlers.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Not Found' });
};

// File: src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

logger.stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger;