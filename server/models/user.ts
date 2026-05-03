import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';
import logger from '../utils/logger';

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    onlineStatus: boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateJWT(): string;
}

interface IUserModel extends Model<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        onlineStatus: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Middleware to hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
    try {
        if (this.isModified('password')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (error) {
        logger.error('Error hashing the password', error);
        next(error);
    }
});

// Method to compare passwords for login
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        logger.error('Error comparing passwords', error);
        throw new Error('Password comparison failed');
    }
};

// Method to generate JWT
UserSchema.methods.generateJWT = function(): string {
    try {
        const payload = { id: this._id, email: this.email };
        return jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
    } catch (error) {
        logger.error('Error generating JWT', error);
        throw new Error('JWT generation failed');
    }
};

// Static method to find user by email
UserSchema.statics.findByEmail = async function(email: string): Promise<IUser | null> {
    try {
        return await this.findOne({ email });
    } catch (error) {
        logger.error('Error finding user by email', error);
        throw new Error('Error finding user');
    }
};

const User: IUserModel = mongoose.model<IUser, IUserModel>('User', UserSchema);

export default User;