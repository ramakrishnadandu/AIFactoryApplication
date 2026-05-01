import mongoose, { Schema, Document, model, Error } from 'mongoose';

// Define the interface for the Todo document
interface ITodo extends Document {
  title: string;
  description: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: Date;
  userId: mongoose.Types.ObjectId;
}

// Create the Todo schema
const TodoSchema: Schema = new Schema<ITodo>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Add Mongoose hooks or methods if necessary
TodoSchema.pre<ITodo>('save', function(next) {
  // Example pre-save hook: log before saving
  console.log('Saving Todo:', this);
  next();
});

TodoSchema.post<ITodo>('save', function(doc, next) {
  // Example post-save hook: log after saving
  console.log('Saved Todo:', doc.title);
  next();
});

// Add methods to the schema
TodoSchema.methods.markAsCompleted = function (): void {
  this.completed = true;
  this.save().catch(error => {
    console.error('Error marking Todo as completed:', error);
  });
};

// Create the model from the schema
const Todo = model<ITodo>('Todo', TodoSchema);

// Export the model
export default Todo;