import mongoose, { Schema, Document } from 'mongoose';

/** 
 * Interface that represents a Greeting Document in MongoDB.
 */
export interface IGreeting extends Document {
  userId: mongoose.Types.ObjectId;
  message: string;
  occasion: string; // e.g., "birthday", "festival"
  createdAt: Date;
  updatedAt: Date;
}

/** 
 * The Schema corresponds to the document interface.
 * It defines the structure of a Greeting document.
 */
const GreetingSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    occasion: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

/**
 * Middleware to ensure greeting message is trimmed and occasion is valid before saving.
 */
GreetingSchema.pre<IGreeting>('save', function (next) {
  // Trims message to remove leading/trailing whitespaces
  this.message = this.message.trim();

  // Validate whether the occasion is among allowed types (example)
  const allowedOccasions = ['birthday', 'festival', 'anniversary'];
  if (!allowedOccasions.includes(this.occasion.toLowerCase())) {
    return next(new Error('Invalid occasion type.'));
  }

  next();
});

/**
 * Method to transform the JSON output of a greeting document.
 * This is useful for customizing the API response.
 */
GreetingSchema.methods.toJSON = function () {
  const greeting = this.toObject();
  delete greeting._id;
  delete greeting.__v;
  return greeting;
};

// Create the Greeting model using the schema
const Greeting = mongoose.model<IGreeting>('Greeting', GreetingSchema);

export default Greeting;