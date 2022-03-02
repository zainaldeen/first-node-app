const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cart: {
        items: [{
            productId: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
            quantity: {type: Number, required: true},
        }]
    }
})

userSchema.methods.addToCart = function (product) {
    let productCartIndex = this.cart.items.findIndex(cr => {
        return cr.productId.toString() === product._id.toString();
    })
    let newQuantity = 1;
    let updatedCartItem = [...this.cart.items];
    if (productCartIndex >= 0 ) {
        newQuantity = this.cart.items[productCartIndex].quantity + 1;
        updatedCartItem[productCartIndex].quantity = newQuantity;
    }else {
        updatedCartItem.push({productId : product._id, quantity: newQuantity});
    }
    const updatedCart = {
        items : updatedCartItem
    };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.removeItemFromCart = function (productId) {
    let updatedCartItem = this.cart.items.filter(e => {
        return e.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItem;
    return this.save();
}
userSchema.methods.deleteCart = function () {
    this.cart.items = [];
    return this.save();
}
module.exports = mongoose.model('User', userSchema);

// const { getDB } = require('../utils/database');
// const mongodb = require('mongodb');
// const table = 'users';
// class User {
//     constructor(name, email, password, cart, _id){
//         this.name = name;
//         this.email = email;
//         this.password = password;
//         this.cart = cart;
//         this._id = _id;
//     }
//
//     save() {
//         let db = getDB();
//         return db.collection(table)
//         .insertOne(this);
//     }
//
//     static findById(id) {
//         const db = getDB();
//         return db.collection(table)
//         .findOne({_id:  new mongodb.ObjectId(id)});
//     }
//
//     addToCart(product) {
//         let productCartIndex = this.cart.items.findIndex(cr => {
//             return cr.product_id.toString() === product._id.toString();
//         })
//         let newQuantity = 1;
//         let updatedCartItem = [...this.cart.items];
//         if (productCartIndex >= 0 ) {
//             newQuantity = this.cart.items[productCartIndex].quantity + 1;
//             updatedCartItem[productCartIndex].quantity = newQuantity;
//         }else {
//             updatedCartItem.push({product_id : product._id, quantity: newQuantity});
//         }
//         const updatedCart = {
//             items : updatedCartItem
//         };
//         const db = getDB();
//         return db.collection(table)
//         .updateOne({_id: new mongodb.ObjectId(this._id)}, { $set : {cart: updatedCart}});
//
//     }
//
//     getCart(){
//         let db = getDB();
//         const productsId = this.cart.items.map(i => {
//             return i.product_id;
//         });
//         return db
//             .collection('products')
//             .find({_id: {$in: productsId}})
//             .toArray()
//             .then(products => {
//                 return products.map(p => {
//                     return {
//                         ...p,
//                         quantity: this.cart.items.find(i => {
//                             return i.product_id.toString() === p._id.toString();
//                         }).quantity
//                     };
//                 });
//             })
//         ;
//
//     }
//
//     deleteItemFromCart(prodId)
//     {
//         const db = getDB();
//         const updatedCartItem = this.cart.items.filter(prod => {
//             return prod.product_id.toString() !== prodId.toString();
//         });
//         return db.collection(table)
//             .updateOne(
//                 {_id: new mongodb.ObjectId(this._id)},
//                 { $set : {cart: {items: updatedCartItem}}}
//             );
//     }
//
//     addOrder()
//     {
//         const db = getDB();
//         return this.getCart()
//             .then(products => {
//                 const order = {
//                     products: products,
//                     user: {
//                         _id: new mongodb.ObjectId(this._id),
//                         name: this.name
//                     }
//                 };
//                 db.collection('orders')
//                     .insertOne(order);
//                 this.cart = {items: []};
//                 return db.collection(table)
//                     .updateOne(
//                         {_id: new mongodb.ObjectId(this._id)},
//                         { $set : {cart: this.cart}}
//                     );
//             })
//     }
//
//     getOrders()
//     {
//         const db = getDB();
//         return db.collection('orders').find({'user._id':  new mongodb.ObjectId(this._id)}).toArray();
//     }
// }
// module.exports = User;
// // For Mysql
// // const Sequelize = require('sequelize');
// // const sequelize = require('../utils/database');
//
// // const User = sequelize.define('user', {
// //     id: {
// //         type: Sequelize.BIGINT,
// //         autoIncrement: true,
// //         allowNull: false,
// //         primaryKey: true
// //     },
// //     name: {
// //         type: Sequelize.STRING,
// //         allowNull: false
// //     },
// //     email: {
// //         type: Sequelize.STRING,
// //         allowNull: false,
// //     }
// // })
//
// // module.exports = User;
