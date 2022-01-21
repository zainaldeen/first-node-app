const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const OrderItem = sequelize.define('orderItem', {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    qty: {
        type: Sequelize.INTEGER,
        default: 1
    }

})

module.exports = OrderItem;