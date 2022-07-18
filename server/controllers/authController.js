import InternalError from '../model/errorModel.js';
import { createJwtToken, addAccessTokenToCookie } from '../auth/index.js';
import User from '../model/userModel.js';

const c = InternalError.asyncCatch;

export const signup = c(async (req, res, next) => {
  const { email, password, passwordConfirm } = req.body;

  if (!password || password !== passwordConfirm) {
    return next(new InternalError("Password doesn't look correct", 500));
  }

  const newUser = await User.create({
    email,
    password,
  });

  newUser.password = undefined;

  const token = createJwtToken(newUser._id);
  addAccessTokenToCookie(res, token);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

export default { signup };
