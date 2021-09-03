const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    console.error('ERROR: ', err);

    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Check environment
  if (process.env.NODE_ENV === 'development') {
    let error = { ...err };
    error.message = err.message;

    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, res, res);
  }
};
