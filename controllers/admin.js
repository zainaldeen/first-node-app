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
    Product.show(req.params.id).then(([product, fileData]) => {
        if (!product)
        {
            return res.redirect('/');
        }
        res.render(
            'admin/add-product',
            {
                pageTitle: "Edit Product",
                path: '/admin/edit-product',
                product: product[0],
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
    product.save().then(res.redirect('/products')).catch(err => console.log(err));
};


exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll().then(([rows, fileDetails]) => {
        res.render(
            'admin/products',
            {
                pageTitle: "Admin Products",
                prods: rows,
                path: '/admin/products'
            });
    }).catch(err => {
        console.log(err);
    });
};

exports.updateProduct = (req, res, next) => {
    let id = req.params.id;

    let product = {
        title : req.body.title,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description
    }
    Product.update(id, product)
        .then(([rows, fileData])=> {
        res.render(
            'admin/products',
            {
                pageTitle: "Admin Products",
                prods: rows,
                path: '/admin/products'
            });
        })
        .catch(err => console.log(err));
    res.redirect('/admin/products');
};

exports.deleteProduct = (req, res, next) => {
    let id = req.params.id;
    Product.delete(id).then(([products, fileData]) => {
        res.render(
            'admin/products',
            {
                pageTitle: "Admin Products",
                prods: products,
                path: '/admin/products'
            });
    }).catch(err=>console.log(err));
    res.redirect('/admin/products');
};
