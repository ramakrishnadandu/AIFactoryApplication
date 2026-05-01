import { Schema, model, Document } from 'mongoose';
import { logger } from '../utils/logger';

interface IEmail extends Document {
  to: string;
  from: string;
  subject: string;
  body: string;
  sentAt: Date;
  status: 'pending' | 'sent' | 'failed';
}

const emailSchema = new Schema<IEmail>({
  to: {
    type: String,
    required: [true, 'Recipient email is required.'],
    validate: {
      validator: (email: string) => /\S+@\S+\.\S+/.test(email),
      message: 'Invalid email format.'
    }
  },
  from: {
    type: String,
    required: [true, 'Sender email is required.'],
    validate: {
      validator: (email: string) => /\S+@\S+\.\S+/.test(email),
      message: 'Invalid email format.'
    }
  },
  subject: {
    type: String,
    required: [true, 'Email subject is required.'],
    maxlength: [255, 'Subject cannot exceed 255 characters.']
  },
  body: {
    type: String,
    required: [true, 'Email body is required.']
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  }
});

emailSchema.post('save', function(doc) {
  logger.info(`Email sent: ${doc.to}, Status: ${doc.status}`);
});

emailSchema.post('error', function(error, doc, next) {
  logger.error(`Error sending email to: ${doc.to}, Error: ${error.message}`);
  next(error);
});

const EmailModel = model<IEmail>('Email', emailSchema);

export default EmailModel;