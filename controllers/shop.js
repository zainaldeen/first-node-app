const Product = require('../models/product');
// const Cart = require('../models/cart');
// const CartItem = require('../models/cartItem');
exports.getIndex= (req, res, next) => {
    res.render(
        'shop/index',
        {
            pageTitle: "E-Shop",
            path: '/'
        });
};

exports.getProducts = (req, res,next) => {
    console.log(req.user );
    Product.findAll().then(result => {
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
    const cart = req.user.getCart()
        .then(cart => {
            cart.getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        pageTitle: 'My Cart',
                        prods: products,
                        path: '/shop/cart'
                    });
                })
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
    })
    .catch(err => {
        console.log(err);
    })
    // let fetchedCart;
    // req.user
    //     .getCart()
    //     .then(cart => {
    //         fetchedCart = cart;
    //         return cart.getProducts({ where: {id: prodId}});
    //     })
    //     .then(products => {
    //         let product;
    //         let newQty = 1;
    //         if (products.length > 0) {
    //             product = products[0];
    //             // TODO get qty for this products and increase it
    //         }
    //         if (product){
    //             product.cartItem.qty += 1;
    //             newQty = product.cartItem.qty;
    //         }
    //         return Product.findById(prodId)
    //                 .then(product => {
    //                     fetchedCart.addProduct(product, { through: { qty: newQty}});
    //                 })
    //                 .catch(err => console.log(err));
    //     })
    //     .then(() => {
    //         res.redirect('/cart');
    //     })
    //     .catch(err => console.log(err));
};


exports.deleteCartProduct = (req, res, next) => {
    const prodId = req.params.id;
    req.user.getCart()
        .then(cart => {
            let cartId = cart.id;
            console.log(cartId);
            CartItem.destroy({where: {
                    productId: prodId,
                    cartId: cartId
                }})
                .then(() => {
                    res.redirect('/cart');
                })
                .catch(err=>console.log(err));
        })
        .catch(err => console.log(err));
}


exports.fetchOrders = (req, res, next) => {
    req.user.getOrders({ include: ['products'] })
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
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts()
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    return order.addProducts(
                        products.map(product => {
                            product.orderItem = { qty: product.cartItem.qty };
                            return product;
                        }));
                })
                .catch(err => console.log(err));
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/order');
        })
        .catch(err => console.log(err));
};


