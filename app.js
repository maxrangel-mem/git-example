const express = require('express');

// Controllers
const { globalErrorHandler } = require('./controllers/error.controller');

// Utils
const { sequelize } = require('./utils/database');
const { AppError } = require('./utils/appError');

// Routers
const userRouter = require('./routes/users.routes');
const authRouter = require('./routes/auth.routes');

// Init app
const app = express();

// Global middlewares
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

sequelize
  .sync()
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch(err => {
    console.log(err);
  });

// Listen on port 3000
app.listen(3000, () => {
  console.log('App running on port 3000!!!!');
});
