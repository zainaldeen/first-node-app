const Product = require('../models/product');
const Cart = require('../models/cart');
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


exports.getProductById = (req, res,next) => {
    let id = req.param('id');
    Product.show(id, prod => {
        console.log(prod);
        res.render('shop/product-card', {pageTitle: 'Product Details', product: prod, path: '/'});
    });

};



exports.getCartPage = (req, res, next) => {
    Cart.fetchAll(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData)
                {
                    cartProducts.push({ product: product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart', {
                pageTitle: 'My Cart',
                prods: cartProducts,
                total_price: cart.total_price,
                path: '/shop/cart'
            });
        })

    });
};

exports.addToCart = (req, res, next) => {
    let id = req.body.id;
    Product.show(id, (product) => {
        Cart.addProductToCart(id, product.price);
    })
    res.redirect('/cart');
};


exports.deleteCartProduct = (req, res, next) => {
    const id = req.params.id;
    Product.show(id, product => {
        Cart.deleteProduct(id, product.price);
    });
    res.redirect('/cart');
}

