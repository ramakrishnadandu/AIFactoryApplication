import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, Message } from './models'; // Assuming models are defined in models.ts
import { verifyToken } from './middleware/auth'; // JWT verification middleware
import { Server } from 'socket.io';
import http from 'http';

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // For demonstration, adjust for production
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(express.json());

// Async error handler utility
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes

// POST /api/chat/send-message
app.post('/api/chat/send-message', verifyToken, asyncHandler(async (req: Request, res: Response) => {
  const { recipientId, content } = req.body;
  const userId = (req as any).user.id; // Assuming added to request by auth middleware

  if (!recipientId || !content) {
    return res.status(400).json({ error: 'Recipient and content are required' });
  }

  // Save message
  const message = await Message.create({
    senderId: userId,
    receiverId: recipientId,
    content,
    timestamp: new Date(),
  });

  // Emit message to recipient via Socket.IO
  io.to(recipientId).emit('receive_message', message);

  res.status(201).json({ message: 'Message sent successfully', data: message });
}));

// GET /api/chat/online-users
app.get('/api/chat/online-users', verifyToken, asyncHandler(async (req: Request, res: Response) => {
  const onlineUsers = await User.find({ online: true }).select('name email');
  res.status(200).json({ onlineUsers });
}));

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('user_online', async (userId) => {
    await User.findByIdAndUpdate(userId, { online: true });
    socket.join(userId);
    socket.broadcast.emit('user_online', userId);
  });

  socket.on('user_offline', async (userId) => {
    await User.findByIdAndUpdate(userId, { online: false });
    socket.broadcast.emit('user_offline', userId);
  });

  socket.on('typing', ({ senderId, receiverId }) => {
    socket.to(receiverId).emit('typing', senderId);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
});

// Start server
const PORT = process.env.PORT || 8002;
server.listen(PORT, () => {
  console.log(`Chat service running on port ${PORT}`);
});

export default app;