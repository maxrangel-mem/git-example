const express = require('express');

// Controller
const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
} = require('../controllers/users.controller');

// Middlewares
const { authToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authToken);

router.get('/', getAllUsers);

router.get('/:userId', getUserById);

router.post('/new-user', createUser);

router.patch('/update-user/:userId', updateUser);

router.delete('/delete-user/:userId', deleteUser);

module.exports = router;
