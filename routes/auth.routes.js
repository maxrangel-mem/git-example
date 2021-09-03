const express = require('express');

// Controllers
const { login } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', login);

module.exports = router;
