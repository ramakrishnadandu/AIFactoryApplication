import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createEvent, getEvents } from './controllers/eventController';
import { ErrorHandler, handleError } from './middleware/errorHandler';
import { logger } from './middleware/logger';

// Initialize the Express application
const app: Application = express();
const PORT = process.env.PORT || 8002;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Logger middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`Incoming request - Method: ${req.method}, URL: ${req.url}`);
    next();
});

// Routes

// Event creation route
app.post('/api/event', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const event = await createEvent(req.body);
        res.status(201).json(event);
    } catch (error) {
        next(error);
    }
});

// Event fetching route
app.get('/api/events', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await getEvents();
        res.status(200).json(events);
    } catch (error) {
        next(error);
    }
});

// Error handling middleware
app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    handleError(err, res);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Event Calendar Service API is running on port ${PORT}`);
});

// controllers/eventController.ts
export const createEvent = async (eventData: any) => {
    if (!eventData || !eventData.name || !eventData.date) {
        throw new ErrorHandler(400, 'Invalid event data');
    }
    // Implement logic to save event to database
    return { id: 'event123', ...eventData }; // Simplified example
};

export const getEvents = async () => {
    // Implement logic to fetch events from database
    return [{ id: 'event123', name: 'Sample Event', date: '2023-10-01' }]; // Simplified example
};

//middleware/errorHandler.ts
export class ErrorHandler extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

export const handleError = (err: ErrorHandler, res: Response) => {
    const { statusCode, message } = err;
    res.status(statusCode).json({
        status: "error",
        statusCode,
        message
    });
};

// middleware/logger.ts
import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new transports.Console()
    ],
});