const fs = require('fs');
const path = require('path');
const Cart = require('./cart');
const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'products.json'
);
getProductsFromFile = cb => {

    fs.readFile(p, (err, contentFile) => {
        if (err) {
            cb([]);
        }else{
            cb(JSON.parse(contentFile));
        }
    })
}

module.exports = class {
    constructor(title, imageUrl, price, description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save() {
        this.id = Math.random().toString();
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                if (err){
                    console.log(err);
                }
            })
        });
    }
    static show(id, cb) {
        getProductsFromFile(products => {
            let prod = products.find(e => e.id === id);
            cb(prod);
        });
    }
    static delete(id, cb) {
        getProductsFromFile(products => {
            let productsArray = [...products];
            let product = products.find(e => e.id === id);
            let productIndex = products.findIndex(e => e.id === id);
            productsArray.splice(productIndex, 1);
            fs.writeFile(p, JSON.stringify(productsArray), err => {
                if (!err)
                {
                    Cart.deleteProduct(product.id, product.price);
                }
                console.log(err);
            })
            cb(productsArray);
        });
    }
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static update(id, product, cb) {
        getProductsFromFile(products => {
            let productIndex = products.findIndex(e => e.id === id);
            console.log(productIndex);
            let updatedProducts = [...products];
            product.id = id;
            products[productIndex] = product;
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            })
            cb(products);
        });
    }
}
