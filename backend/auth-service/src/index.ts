import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Sample user data to simulate a database
const users = [
  { id: 1, username: 'user1', password: 'password1', interests: ['coding', 'music'] },
  { id: 2, username: 'user2', password: 'password2', interests: [] }
];

// Error handling middleware
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.status(500).send({ message: 'Internal Server Error' });
}

// Auth Middleware
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '', (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Routes
app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).send({ message: 'Invalid credentials' });
  }

  const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET || '', { expiresIn: '24h' });
  res.json({ accessToken });
});

app.get('/interests', authenticateToken, (req: Request, res: Response) => {
  const user = users.find(user => user.username === req.user.username);

  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }

  res.json(user.interests);
});

app.post('/interests', authenticateToken, (req: Request, res: Response) => {
  const user = users.find(user => user.username === req.user.username);

  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }

  if (!Array.isArray(req.body.interests)) {
    return res.status(400).send({ message: 'Invalid interests format' });
  }

  user.interests = req.body.interests;
  res.status(200).send({ message: 'Interests updated' });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Auth Service running at http://localhost:${PORT}`);
});