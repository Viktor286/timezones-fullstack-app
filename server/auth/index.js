import jwt from 'jsonwebtoken';

export function createJwtToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

export function addAccessTokenToCookie(res, token) {
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'prod') cookieOptions.secure = true;
  res.cookie('access_token', token, cookieOptions);
  return res;
}
