const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
    let isLoggedIn = req.session.isLoggedIn;
    res.render(
        'admin/add-product',
        {
            pageTitle: "Add Product",
            path: '/admin/add-product',
            editing: false,
            isAuthenticated: isLoggedIn
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
            let isLoggedIn = req.session.isLoggedIn;
            if (!product) {
                return res.redirect('/');
            }
            res.render(
                'admin/add-product',
                {
                    pageTitle: "Edit Product",
                    path: '/admin/edit-product',
                    product: product,
                    editing: editMode,
                    isAuthenticated: isLoggedIn
                });
    })

};


exports.postAddProduct = async (req, res, next) => {
    const title = req.body.title;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    let product = new Product({title: title, description:description, imageUrl:imageUrl, price:price, userId: req.user});
    product.save()
    .then(() => {
        res.redirect('/products');
    })
    .catch(err => console.log(err));
};


exports.getAdminProducts = (req, res, next) => {
    Product.find()
    .then((rows) => {
        res.render(
            'admin/products',
            {
                pageTitle: "Admin Products",
                prods: rows,
                path: '/admin/products',
            });
    }).catch(err => {
        console.log(err);
    });
};

exports.updateProduct = (req, res, next) => {
    Product.findById(req.params.id).then(product => {
        product.title = req.body.title;
        product.price = req.body.price;
        product.description = req.body.description;
        product.imageUrl = req.body.imageUrl
        return product.save();
    })
    .then(result  => {
        console.log('Updated Successfully');
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.deleteProduct = async (req, res, next) => {
    let id = req.params.id;
    await Product.findByIdAndRemove(id)
       .then(() => {
           res.redirect('/admin/products');
    }).catch(err=>console.log(err));
};
