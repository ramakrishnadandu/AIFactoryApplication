import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { logger } from '../utils/logger';  // Assuming there's a logger utility

// Interface for User Document
interface IUser extends Document {
    email: string;
    password: string;
    verifyPassword(candidatePassword: string): Promise<boolean>;
}

// Mongoose Schema for User
const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
    }
}, {
    timestamps: true
});

// Pre-save hook to hash passwords
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        logger.error('Error hashing password', error);
        return next(error);
    }
});

// Method to compare password for authentication
UserSchema.methods.verifyPassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        logger.error('Error comparing passwords', error);
        throw new Error('Error comparing passwords');
    }
};

// User Model
const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;