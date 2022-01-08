// const mysql = require('mysql2');
//
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'node-store'
// })
//
// module.exports = pool.promise();


const Sequelize = require('sequelize');
const sequelize = new Sequelize('node-store', 'root', '', {
    dialect : 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
