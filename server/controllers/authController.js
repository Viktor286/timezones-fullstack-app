import bcrypt from 'bcryptjs';
import User from '../model/userModel.js';
import ServerError from '../model/errorModel.js';
import {
  createJwtToken,
  addAccessTokenToCookie,
  createExpiredJwtToken,
  restrictToAuthorizedUsers,
  authorizeUser,
} from '../auth/index.js';

const c = ServerError.asyncCatch;

export const signup = c(async (req, res, next) => {
  const { email, password, passwordConfirm } = req.body;

  if (!password || password !== passwordConfirm) {
    return next(new ServerError("Password doesn't look correct", 500));
  }

  const newUser = await User.create({
    email,
    password: await bcrypt.hash(password, 12),
  });

  const token = createJwtToken(newUser._id);
  addAccessTokenToCookie(res, token);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: {
        email: newUser.email,
        role: newUser.role,
      },
    },
  });
});

export const signin = c(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ServerError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ServerError('Incorrect email or password', 401));
  }

  const token = createJwtToken(user._id);
  addAccessTokenToCookie(res, token);
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        email,
        role: user.role,
      },
    },
  });
});

export const logout = c(async (req, res, next) => {
  const auth = await restrictToAuthorizedUsers(
    ['admin', 'manager', 'user'],
    await authorizeUser(req),
    req,
  );
  if (!auth || auth instanceof ServerError) return next(auth);

  // todo: we may need to store logged-out tokens and check disposed ones

  const token = createExpiredJwtToken(req.user._id);
  addAccessTokenToCookie(res, token, 1);
  res.status(200).json({ status: 'success', token });
});

export default { signup, signin, logout };
