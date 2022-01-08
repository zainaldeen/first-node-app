const fs = require('fs');
const path = require('path');
const Product = require('./product');
const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'cart.json'
);

getCartsFromFile = cb => {

    fs.readFile(p, (err, contentFile) => {
        if (err) {
            cb([]);
        }else{
            cb(JSON.parse(contentFile));
        }
    })
}

module.exports = class {

    static addProductToCart(id, productPrice) {
        console.log('price'+ productPrice);
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], total_price: 0};
            if (!err)
            {
                cart = JSON.parse(fileContent);
            }
            let existsProductIndex = cart.products.findIndex(e => e.id === id);
            let existsProduct = cart.products[existsProductIndex];
            let updatedProduct;
            if (existsProduct)
            {
                updatedProduct = { ...existsProduct };
                updatedProduct.qty = +updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existsProductIndex] = updatedProduct;
            }else {
                let new_product = { id: id, qty: 1};
                cart.products = [...cart.products, new_product];
            }
            cart.total_price = +cart.total_price + +productPrice;
            let data = JSON.stringify(cart);
            fs.writeFile(p, data, (err) => {
                console.log(err);
            })
        })
    }

    static fetchAll(cb) {
        getCartsFromFile(cb);
    }

    static deleteProduct(id, price) {
        fs.readFile(p, (err, fileContent) => {
            let cart = { ...JSON.parse(fileContent) };
            console.log(id);
            let product = cart.products.find(e => e.id === id);
            if (product) {
                let qty = product.qty;
                cart.total_price -= price * qty;
                cart.products = cart.products.filter(e => e.id !== id);
                let data = JSON.stringify(cart);
                fs.writeFile(p, data, (err) => {
                    console.log(err);
                })
            }

        });
    }
}

