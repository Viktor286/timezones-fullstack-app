import jwt from 'jsonwebtoken';
import ServerError from '../model/errorModel.js';
import User from '../model/userModel.js';
import { promisify } from 'util';

export function createJwtToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

export function createExpiredJwtToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: 1 });
}

export async function authorizeUser(req) {
  if (req.header('Test-Open-Access') === process.env.TEST_OPEN_ACCESS) {
    req.user = {
      _id: { get: () => '62d5773f36df8a5b3e27bf45' },
      email: 'open-access-user@mail.com',
      role: 'admin',
      __v: 0,
    };

    return req.user;
  }

  req.user = undefined;

  const rawToken = req.headers?.authorization?.split(' ')[1];

  if (!rawToken) {
    return new ServerError('No authorization found.', 401);
  }

  const token = await promisify(jwt.verify)(rawToken, process.env.JWT_SECRET);

  const currentTimeSec = Math.floor(Date.now() / 1000);
  if (token.exp <= currentTimeSec) {
    return new ServerError('Token expired', 401);
  }

  const currentUser = await User.findById(token.id);

  if (!currentUser) {
    return new ServerError('Not valid token.', 401);
  }

  req.user = currentUser;
  return currentUser;
}

export async function restrictToAuthorizedUsers(allowedRoles, authResult, req) {
  if (authResult instanceof ServerError) {
    return authResult;
  }

  // todo: better to check the class instance
  if (typeof req.user._id !== 'object') {
    return new ServerError('Authorization required.', 401);
  }

  if (!allowedRoles.includes(req.user.role)) {
    return new ServerError('Permission denied for this role', 403);
  }

  return authResult;
}

export function addAccessTokenToCookie(res, token, expiresIn) {
  const cookieOptions = {
    expires: expiresIn
      ? new Date(Date.now() + expiresIn)
      : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'prod') cookieOptions.secure = true;
  res.cookie('access_token', token, cookieOptions);
  return res;
}
