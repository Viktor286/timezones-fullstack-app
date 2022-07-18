import mongoose from 'mongoose';
import validator from 'validator';

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
    enum: ['user', 'manager', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Valid password is required'],
    minlength: 8,
    select: false,
  },
});

export default mongoose.model('User', userSchema);
