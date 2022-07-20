import ServerError from '../model/errorModel.js';

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'prod') {
    let error = { ...err };

    switch (error.name) {
      case 'CastError':
        error = new ServerError(`Invalid ${err.path}: ${err.value}.`, 400);
        break;

      case 'ValidationError':
        const errors = Object.values(err.errors).map((el) => el.message);
        error = new ServerError(`Invalid input data. ${errors.join('. ')}`, 400);
        break;

      case 'JsonWebTokenError':
        error = new ServerError('Invalid token. Try to log in again.', 401);
        break;

      case 'TokenExpiredError':
        error = new ServerError('Token has expired. Try to log in again.', 401);
        break;
    }

    if (err.code === 11000) {
      error = new ServerError(`Duplicate field value: ${err.errmsg}.`, 400);
    }

    responseErrorProd(error, res);
  } else {
    responseErrorDev(err, res);
  }
};

function responseErrorDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function responseErrorProd(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('Server Error: ', err, JSON.stringify(err));
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong.',
    });
  }
}
