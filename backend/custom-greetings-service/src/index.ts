import express, { Request, Response, NextFunction } from 'express';
import { createUser, authenticateUser } from './user.service';
import { generateGreeting } from './greeting.service';
import { registerUserSchema, loginUserSchema } from './validationSchemas';
import { sendConfirmationEmail } from './email.service';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

const app = express();
const PORT = 8001;

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Internal Server Error' });
});

// User registration route
app.post('/register', async (req: Request, res: Response) => {
  const { error } = registerUserSchema.validate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  try {
    const user = await createUser(req.body);
    sendConfirmationEmail(user.email);
    res.status(201).send({ message: 'Registration successful. Confirmation email sent.' });
  } catch (err) {
    res.status(400).send({ error: 'Registration failed. ' + err.message });
  }
});

// User login route
app.post('/login', async (req: Request, res: Response) => {
  const { error } = loginUserSchema.validate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  try {
    const token = await authenticateUser(req.body.email, req.body.password);
    res.status(200).send({ message: 'Login successful', token });
  } catch (err) {
    res.status(401).send({ error: 'Authentication failed. ' + err.message });
  }
});

// Greeting route
app.post('/greet', async (req: Request, res: Response) => {
  try {
    const greeting = await generateGreeting(req.body.userId, req.body.eventId);
    res.status(200).send({ greeting });
  } catch (err) {
    res.status(400).send({ error: 'Failed to generate greeting. ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Custom Greetings Service API is running on port ${PORT}`);
});

// Placeholder services for demonstration purposes
async function createUser(data: any) {
  // Simulate user creation
  return { id: '1', email: data.email };
}

async function authenticateUser(email: string, password: string) {
  // Simulate user authentication
  if (email === 'test@example.com' && password === 'password') {
    return 'dummy_token';
  }
  throw new Error('Invalid credentials');
}

async function generateGreeting(userId: string, eventId: string) {
  // Simulate personal greeting generation
  return `Hello User ${userId}, wishing you well on your event ${eventId}!`;
}