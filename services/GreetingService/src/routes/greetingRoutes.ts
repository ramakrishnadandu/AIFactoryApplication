import express, { Request, Response, NextFunction } from 'express';
import { validateToken } from '../middleware/authMiddleware';
import { generateGreeting, validateGreetingInput } from '../services/greetingService';

const router = express.Router();

// Middleware for logging errors
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
};

// Route to generate a dynamic greeting for a given occasion
router.post('/greet', validateToken, async (req: Request, res: Response) => {
    try {
        const { userId, occasion } = req.body;

        // Validate input
        if (!userId || !occasion) {
            return res.status(400).json({ error: 'Missing userId or occasion in request body' });
        }

        // Validate the occasion using a service
        const isValid = validateGreetingInput(occasion);
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid occasion supplied' });
        }
        
        // Generate greeting
        const greetingMessage = await generateGreeting(userId, occasion);
        
        // Send response
        res.status(200).json({ message: greetingMessage });
    } catch (error) {
        next(error);
    }
});

// Route to fetch available occasions
router.get('/occasions', validateToken, (req: Request, res: Response) => {
    try {
        const occasions = ['Birthday', 'Festivals', 'Anniversary', 'New Year'];
        res.status(200).json({ occasions });
    } catch (error) {
        res.status(500).json({ error: 'Cannot fetch occasions list' });
    }
});

// Use the error handler middleware
router.use(errorHandler);

export default router;

// Middleware to validate token - Dummy Implementation
async function validateToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // Simulating token validation
        const valid = token === "valid-token"; // Replace with actual validation logic
        if (!valid) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    } catch (error) {
        next(error);
    }
}

// Service for generating greetings - Dummy Implementation
async function generateGreeting(userId: string, occasion: string): Promise<string> {
    // Add logic to generate personalized greeting
    return `Happy ${occasion}!`; // Placeholder
}

// Function to validate greeting input - Dummy Implementation
function validateGreetingInput(occasion: string): boolean {
    const validOccasions = ['Birthday', 'Festivals', 'Anniversary', 'New Year'];
    return validOccasions.includes(occasion);
}