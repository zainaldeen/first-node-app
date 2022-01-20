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
    req.user.getProducts({where: {id: req.params.id}})
        .then(product => {
            if (!product) {
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


exports.postAddProduct = async (req, res, next) => {
    const title = req.body.title;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    await req.user.createProduct({
        title: title,
        price: price,
        description: description,
        imageUrl:imageUrl
    })
    .then()
    .catch(err => console.log(err));
    res.redirect('/products');
};


exports.getAdminProducts = (req, res, next) => {
    req.user.getProducts()
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

exports.updateProduct = async (req, res, next) => {
    let id = req.params.id;
    await Product.findById(id)
        .then(product => {
            product.title = req.body.title;
            product.imageUrl = req.body.imageUrl;
            product.price = req.body.price;
            product.description = req.body.description;
            return product.save();
        })
        .then(result => {
            console.log('Updated Successfully');
        })
        .catch(err => console.log(err));
    res.redirect('/admin/products');
};

exports.deleteProduct = async (req, res, next) => {
    let id = req.params.id;
    await Product.findById(id)
       .then(result => {
           result.destroy();
           console.log('Deleted Successfully');
    }).catch(err=>console.log(err));
    res.redirect('/admin/products');
};
