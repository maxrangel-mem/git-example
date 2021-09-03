const bcrypt = require('bcryptjs');

// Models
const { User } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // SELECT * FROM users;
  const users = await User.findAll();

  res.status(200).json({ status: 'success', data: { users } });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  // SELECT * FROM users WHERE id = userId
  const user = await User.findOne({ where: { id: userId } });

  if (!user) {
    return next(new AppError('Usuario no encontrado', 404));
  }

  res.status(200).json({ status: 'success', data: { user } });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({ name, email, password: hashPassword });

  res.status(201).json({ status: 'success', data: { newUser } });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { newName } = req.body;

  // 1. Directly from model
  await User.update({ where: { id: userId } }, { name: newName });

  // 2. From model's instance
  // const user = await User.findOne({ where: { id: userId } });
  // await user.update({ name: newName });

  res.status(204).json({ status: 'success' });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  await User.destroy({ where: { id: userId } });

  // const user = await User.findOne({ where: { id: userId } })
  // await user.destroy()

  res.status(204).json({ status: 'success' });
});
