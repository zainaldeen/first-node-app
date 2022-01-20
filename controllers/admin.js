const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render(
        'admin/add-product',
        {
            pageTitle: "Add Product",
            path: '/admin/add-product',
            editing: false
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query;
    if (!editMode)
    {
        return res.redirect('/');
    }
    Product.show(req.params.id, (product) => {
        if (!product)
        {
            return res.redirect('/');
        }
        res.render(
            'admin/add-product',
            {
                pageTitle: "Edit Product",
                path: '/admin/edit-product',
                product: product,
                editing: editMode
            });
    })

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

exports.updateProduct = (req, res, next) => {
    console.log('is here!');
    let id = req.params.id;

    let product = {
        title : req.body.title,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description
    }
    Product.update(id, product, (products) => {
        console.log(products);
        res.render(
            'admin/products',
            {
                pageTitle: "Admin Products",
                prods: products,
                path: '/admin/products'
            });
    })
    res.redirect('/admin/products');
};

exports.deleteProduct = (req, res, next) => {
    let id = req.params.id;
    Product.delete(id, (products) => {
        res.render(
            'admin/products',
            {
                pageTitle: "Admin Products",
                prods: products,
                path: '/admin/products'
            });
    })
    res.redirect('/admin/products');
};
