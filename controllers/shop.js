const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex= (req, res, next) => {
    res.render(
        'shop/index',
        {
            pageTitle: "E-Shop",
            path: '/'
        });
};

exports.getProducts = (req, res,next) => {
    Product.find().populate('userId', 'name').then(result => {
        console.log(result);
        res.render('shop/product-list', {pageTitle: 'Shop', prods: result, path: '/'});
    }).catch(err => {
        console.log(err);
    });
};


exports.getProductById = (req, res,next) => {
    console.log(req);
    let id = req.param('id');
    Product.findById(id).then((result) => {
        res.render('shop/product-card', {pageTitle: 'Product Details', product: result, path: '/'});
    }).catch(err => console.log(err));
};



exports.getCartPage = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            let products = user.cart.items;
            res.render('shop/cart', {
                pageTitle: 'My Cart',
                prods: products,
                path: '/shop/cart'
            });
        })
        .catch(err => console.log(err));
};

exports.addToCart = async (req, res, next) => {
    let prodId = req.body.id;
    Product.findById(prodId)
    .then(product => {
        return req.user.addToCart(product);
    })
    .then(result => {
        console.log(result);
        res.redirect('/cart');
    })
    .catch(err => {
        console.log(err);
    })
};


exports.deleteCartProduct = (req, res, next) => {
    const prodId = req.params.id;
    req.user.removeItemFromCart(prodId)
        .then(user => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}


exports.fetchOrders = (req, res, next) => {
    Order.find({'user.userId': req.user._id})
        .then(orders => {
            res.render('shop/order', {
                pageTitle: "Your Orders",
                path: '/order',
                orders: orders
            });
        })
        .catch(err => console.log(err));

};

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            let products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: i.productId._doc}
            });
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user
                },
                products: products
            });
            order.save();
        })
        // .then(r => {
        //     return req.user.deleteCart();
        // })
        .then(result => {
            res.redirect('/order');
        })
        .catch(err => console.log(err));
};


