const mongodb = require('mongodb');
const { getDB } = require('../utils/database');
const table = "products";
class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }
    save() {
        const db = getDB();
        let dbOp;
        if (this._id)
        {
            dbOp = db
            .collection(table)
            .updateOne({ _id: this._id }, {$set: this});
        } else {
            dbOp = db
            .collection(table)
            .insertOne(this);
        }
        return dbOp
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }

    static findAll() {
        const db = getDB();
        return db.collection("products")
        .find()
        .toArray()
        .then(products => {
            return products;
        })
        .catch(err => console.log(err));
    }

    static findById(id) {
        const db = getDB();
        return db.collection(table)
        .find({_id: new mongodb.ObjectId(id)})
        .next()
        .then(product => {
            return product;
        })
        .catch(err => console.log(err));
    }
    static deleteById(id) {
        const db = getDB();
        return db.collection(table)
        .deleteOne({_id: new mongodb.ObjectId(id)})
        .then(() => {
            console.log("Deleting Successfully");
        })
        .catch(err => console.log(err));
    }
}


module.exports = Product;



// For MySql



// const Sequelize = require('sequelize');
// const sequelize = require('../utils/database');

// const Product = sequelize.define('product', {
//     id: {
//         type: Sequelize.BIGINT,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     title: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     price: {
//         type: Sequelize.DOUBLE,
//         allowNull: false,
//     },
//     description: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     imageUrl: {
//         type: Sequelize.TEXT,
//         allowNull: false
//     }
// })