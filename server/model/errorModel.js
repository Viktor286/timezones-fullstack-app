export default class ServerError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  // async fn catcher
  static asyncCatch = (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  };
}
