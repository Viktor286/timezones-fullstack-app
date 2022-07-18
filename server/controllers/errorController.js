import InternalError from '../model/errorModel.js';

const responseErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    ...err,
  });
};

const responseErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong.',
    });
  }
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'prod') {
    let error = { ...err };

    switch (error.name) {
      case 'ValidationError':
        const errors = Object.values(err.errors).map((el) => el.message);
        error = new InternalError(`Invalid input data. ${errors.join('. ')}`, 400);
        break;
    }

    responseErrorProd(error, res);
  }

  responseErrorDev(err, res);
};
