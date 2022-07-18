import mongoose from 'mongoose';
import validator from 'validator';

export const roles = ['admin', 'manager', 'user'];

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Valid email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Valid email is required'],
  },
  role: {
    type: String,
    enum: roles,
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Valid password is required'],
    minlength: 8,
    select: false,
  },
  timezones: {
    type: String,
    default: '[]',
  },
});

export default mongoose.model('User', userSchema);
