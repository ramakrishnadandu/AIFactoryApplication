import mongoose, { Schema, Document } from 'mongoose';

// Define the Message interface based on the message data structure
interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
}

// Create the Message schema
const MessageSchema: Schema = new Schema({
  senderId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  receiverId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Add index for efficient queries
MessageSchema.index({ senderId: 1, receiverId: 1, timestamp: -1 });

// Error handling middleware
MessageSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    console.error('There was a duplicate key error:', error.message);
    next(new Error('Duplicate key error: ' + error.message));
  } else if (error) {
    console.error('Error saving message:', error.message);
    next(new Error('Error saving message: ' + error.message));
  } else {
    next();
  }
});

// Export the Message model
const Message = mongoose.model<IMessage>('Message', MessageSchema);
export default Message;