const Product = require('../models/product');

exports.getIndex= (req, res, next) => {
    res.render(
        'shop/index',
        {
            pageTitle: "E-Shop",
            path: '/'
        });
};

exports.getProducts = (req, res,next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {pageTitle: 'Shop', prods: products, path: '/'});
    });
};

exports.getCartPage = (req, res, next) => {
    res.render(
        'shop/cart',
        {
            pageTitle: "My Cart",
            path: '/cart'
        });
};
