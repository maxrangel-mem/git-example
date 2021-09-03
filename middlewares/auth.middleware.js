const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');

// Utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

dotenv.config({ path: './config.env' });

exports.authToken = catchAsync(async (req, res, next) => {
  // Get token from request

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Sesión invalida', 501));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SIGN);

  const currentUser = await User.findOne({ where: { id: decoded.id } });

  if (!currentUser) {
    return next(new AppError('Usuario invalido', 401));
  }

  next();
});
