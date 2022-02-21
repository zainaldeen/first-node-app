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
    Product.findById(req.params.id)
        .then(product => {
            if (!product) {
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


exports.postAddProduct = async (req, res, next) => {
    const title = req.body.title;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    let product = new Product(title, description, imageUrl, price, null, req.user._id);
    product.save()
    .then()
    .catch(err => console.log(err));
    res.redirect('/products');
};


exports.getAdminProducts = (req, res, next) => {
    Product.findAll()
    .then((rows) => {
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
    const product = new Product(req.body.title, req.body.price, req.body.description, req.body.imageUrl, req.params.id);
    product.save()
        .then(() => {
            console.log('Updated Successfully');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.deleteProduct = async (req, res, next) => {
    let id = req.params.id;
    await Product.deleteById(id)
       .then(() => {
           res.redirect('/admin/products');
    }).catch(err=>console.log(err));
};
