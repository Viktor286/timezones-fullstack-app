import User, { roles } from '../model/userModel.js';
import { authorizeUser, restrictToAuthorizedUsers } from '../auth/index.js';
import { objectFieldsGate } from '../utils/index.js';
import ServerError from '../model/errorModel.js';
import bcrypt from 'bcryptjs';

const c = ServerError.asyncCatch;

export const getUser = c(async (req, res, next) => {
  const auth = await restrictToAuthorizedUsers(
    ['admin', 'manager', 'user'],
    await authorizeUser(req),
    req,
  );
  if (!auth || auth instanceof ServerError) return next(auth);

  const accessAllowedFor = [
    req.user.email === req.params.email,
    req.user.role === 'admin',
    req.user.role === 'manager',
  ];

  if (!accessAllowedFor.some((val) => val)) {
    return next(new ServerError('Permission denied', 403));
  }

  const targetUser = await User.findOne({ _id: req.user._id });

  if (!targetUser) {
    return next(new ServerError('No user found with that ID', 404));
  }

  if (roles.indexOf(targetUser.role) > roles.indexOf(req.user.role)) {
    return next(new ServerError('Not enough access rights', 403));
  }

  res.status(200).json({
    status: 'success',
    results: targetUser.length,
    data: {
      user: targetUser,
    },
  });
});

export const updateUser = c(async (req, res, next) => {
  const auth = await restrictToAuthorizedUsers(
    ['admin', 'manager', 'user'],
    await authorizeUser(req),
    req,
  );
  if (!auth || auth instanceof ServerError) return next(auth);

  const accessAllowedFor = [
    req.user.email === req.params.email,
    req.user.role === 'admin',
    req.user.role === 'manager',
  ];

  if (!accessAllowedFor.some((val) => val)) {
    return next(new ServerError('Permission denied', 403));
  }

  const propsAllowedForUpdate = objectFieldsGate(req.body, 'timezones');

  const user = await User.findByIdAndUpdate({ _id: req.user._id }, propsAllowedForUpdate, {
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
  const auth = await restrictToAuthorizedUsers(['admin'], await authorizeUser(req), req);
  if (!auth || auth instanceof ServerError) return next(auth);

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
  const auth = await restrictToAuthorizedUsers(['admin'], await authorizeUser(req), req);
  if (!auth || auth instanceof ServerError) return next(auth);

  const userId = req.params.email;
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
  const auth = await restrictToAuthorizedUsers(['admin', 'manager'], await authorizeUser(req), req);
  if (!auth || auth instanceof ServerError) return next(auth);

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
