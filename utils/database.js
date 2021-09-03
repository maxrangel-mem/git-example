const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('capjs', 'root', '', {
  dialect: 'mysql',
  host: 'localhost',
});

exports.sequelize = sequelize;
