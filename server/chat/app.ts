import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserModel from './models/User';
import MessageModel from './models/Message';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

mongoose.connect(process.env.MONGO_URI!, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

interface JWTPayload {
  id: string;
  email: string;
}

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded: any) => {
    if (err) {
      return next(new Error('Authentication error'));
    }
    socket.data.userId = decoded.id;
    next();
  });
});

io.on('connection', (socket: Socket) => {
  console.log(`User connected: ${socket.data.userId}`);
  socket.join(socket.data.userId);

  UserModel.findByIdAndUpdate(socket.data.userId, { online: true }, { new: true })
    .then(user => {
      if (user) {
        socket.broadcast.emit('user_online', { userId: user.id });
        socket.on('send_message', (messageData) => handleSendMessage(socket, messageData));
        socket.on('typing', (data) => handleTyping(socket, data));
        socket.on('disconnect', () => handleDisconnect(socket));
      }
    })
    .catch(err => console.error('Error updating user status:', err));
});

function handleSendMessage(socket: Socket, messageData: any) {
  const { receiverId, content } = messageData;
  const message = new MessageModel({
    senderId: socket.data.userId,
    receiverId,
    content,
    timestamp: new Date()
  });

  message.save()
    .then(savedMessage => {
      io.to(receiverId).emit('receive_message', { ...savedMessage.toObject() });
      socket.emit('message_sent', { messageId: savedMessage.id });
    })
    .catch(err => console.error('Error saving message:', err));
}

function handleTyping(socket: Socket, data: any) {
  const { receiverId, isTyping } = data;
  io.to(receiverId).emit('typing', { userId: socket.data.userId, isTyping });
}

function handleDisconnect(socket: Socket) {
  UserModel.findByIdAndUpdate(socket.data.userId, { online: false }, { new: true })
    .then(user => {
      if (user) {
        io.emit('user_offline', { userId: user.id });
      }
    })
    .catch(err => console.error('Error updating user status on disconnect:', err));
}

const PORT = process.env.PORT || 8002;
server.listen(PORT, () => {
  console.log(`ChatService is listening on port ${PORT}`);
});