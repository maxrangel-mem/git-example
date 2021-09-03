const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

dotenv.config({ path: './config.env' });

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Verify that user exists
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return next(new AppError('Correo y/o contraseña invalidos', 500));
  }

  // Compare hashed passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return next(new AppError('Correo y/o contraseña invalidos', 500));
  }

  // Generate JWT
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SIGN, {
    expiresIn: '30d',
  });

  user.password = undefined;

  res.status(200).json({ status: 'success', data: { user, token } });
});
