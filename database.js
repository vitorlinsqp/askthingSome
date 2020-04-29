const Sequelize = require("sequelize");

const connection = new Sequelize("asks_guide", "root", "ventura", {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = connection;