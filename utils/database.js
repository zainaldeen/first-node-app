const Sequelize = require('sequelize');
const sequelize = new Sequelize('node-store', 'root', '', {
    dialect : 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
