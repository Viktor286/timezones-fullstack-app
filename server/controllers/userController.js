import User from '../model/userModel.js';
import { authorizeUser, restrictToAuthorizedUsers } from '../auth/index.js';
import { objectFieldsGate } from '../utils/index.js';
import ServerError from '../model/errorModel.js';
import bcrypt from 'bcryptjs';

const c = ServerError.asyncCatch;

export const getUser = c(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.find(userId);

  if (!user) {
    return next(new ServerError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    results: user.length,
    data: {
      user,
    },
  });
});

export const updateUser = c(async (req, res, next) => {
  const userProps = objectFieldsGate(req.body, 'email');

  const user = await User.findByIdAndUpdate(userId, userProps, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ServerError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const createUser = c(async (req, res, next) => {
  await restrictToAuthorizedUsers(['admin'], await authorizeUser(req), req, next);

  const { email, password, passwordConfirm, role } = req.body;

  if (!password || password !== passwordConfirm) {
    return next(new ServerError("Password doesn't look correct", 500));
  }

  const newUser = await User.create({
    email,
    password: await bcrypt.hash(password, 12),
    role,
  });

  res.status(201).json({
    status: 'success',
    data: {
      email: newUser.email,
      role: newUser.role,
    },
  });
});

export const deleteUser = c(async (req, res, next) => {
  await restrictToAuthorizedUsers(['admin'], await authorizeUser(req), req, next);

  const userId = req.params.id;
  const user = await User.findOneAndDelete(userId);

  if (!user) {
    return next(new ServerError('No user found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getAllUsers = c(async (req, res, next) => {
  await restrictToAuthorizedUsers(['admin', 'manager'], await authorizeUser(req), req, next);

  const filter = req.user.role === 'admin' ? {} : { role: 'user' };
  const users = await User.find(filter);
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

export default { createUser, getUser, updateUser, deleteUser, getAllUsers };
