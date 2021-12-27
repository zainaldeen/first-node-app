const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render(
        'admin/add-product',
        {
            pageTitle: "Add Product",
            path: '/admin/add-product'
        });
};
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const product = new Product(title, imageUrl, price, description);
    product.save();
    res.redirect('/products');
};

exports.getProducts = (req, res,next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {pageTitle: 'Shop', prods: products, path: '/'});
    });

};

exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render(
            'admin/products',
            {
                pageTitle: "Admin Products",
                prods: products,
                path: '/admin/products'
            });
    });
};
