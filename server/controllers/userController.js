import User from '../model/userModel.js';
import { objectFieldsGate } from '../utils/index.js';
import ServerError from '../model/errorModel.js';

const c = ServerError.asyncCatch;

export const createUser = c(async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

export const getUser = c(async (req, res, next) => {
  console.log('getUser');
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
  console.log('updateUser');
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

export const deleteUser = c(async (req, res, next) => {
  // todo: limit access based on role and Test-Open-Access:
  //   const testerAccess = req.header('Test-Open-Access') === process.env.TEST_OPEN_ACCESS;

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
  console.log('getAllUsers');
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

export default { createUser, getUser, updateUser, deleteUser, getAllUsers };
