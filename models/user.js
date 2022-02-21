const { getDB } = require('../utils/database');
const mongodb = require('mongodb');
const table = 'users';
class User {
    constructor(name, email, password, cart, _id){
        this.name = name;
        this.email = email;
        this.password = password;
        this.cart = cart;
        this._id = _id;
    }

    save() {
        db = getDB();
        return db.collection(table)
        .insertOne(this);
    }

    static findById(id) {
        const db = getDB();
        return db.collection(table)
        .findOne({_id:  new mongodb.ObjectId(id)});
    }

    addToCart(product) {
        console.log(this);
        let productCartIndex = this.cart.items.findIndex(cr => {
            return cr.product_id.toString() === product._id.toString();
        })
        let newQuantity = 1;
        let updatedCartItem = [...this.cart.items];
        if (productCartIndex >= 0 ) {
            newQuantity = this.cart.items[productCartIndex].quantity + 1;
            updatedCartItem[productCartIndex].quantity = newQuantity;
        }else {
            updatedCartItem.push({product_id : product._id, quantity: newQuantity});
        }

        console.log(updatedCartItem);
        const updatedCart = {
            items : updatedCartItem
        };
        const db = getDB();
        return db.collection(table)
        .updateOne({_id: new mongodb.ObjectId(this._id)}, { $set : {cart: updatedCart}});

    }
}
module.exports = User;
// For Mysql
// const Sequelize = require('sequelize');
// const sequelize = require('../utils/database');

// const User = sequelize.define('user', {
//     id: {
//         type: Sequelize.BIGINT,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     name: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     email: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     }
// })

// module.exports = User;