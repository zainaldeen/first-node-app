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
    Product.fetchAll().then(([rows, fileDetails]) => {
        res.render('shop/product-list', {pageTitle: 'Shop', prods: rows, path: '/'});
    }).catch(err => {
        console.log(err);
    });
};


exports.getProductById = (req, res,next) => {
    let id = req.param('id');
    Product.show(id).then(([rows, fileDetails]) => {
        res.render('shop/product-card', {pageTitle: 'Product Details', product: rows[0], path: '/'});
    }).catch(err => console.log(err));
};



exports.getCartPage = (req, res, next) => {
    Cart.fetchAll(cart => {
        Product.fetchAll().then(([products,fileData]) => {
            const cartProducts = [];
            console.log(products);
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id == product.id);
                if (cartProductData)
                {
                    cartProducts.push({ product: product, qty: cartProductData.qty});
                }
            }
            console.log(cartProducts);
            res.render('shop/cart', {
                pageTitle: 'My Cart',
                prods: cartProducts,
                total_price: cart.total_price,
                path: '/shop/cart'
            });
        }).catch(err=>console.log(err));
    });
};

exports.addToCart = async (req, res, next) => {
    let id = req.body.id;
    await Product.show(id).then(([product, fileData]) => {
        Cart.addProductToCart(id, product[0].price);
    }).catch(err => console.log(err));
    res.redirect('/cart');
};


exports.deleteCartProduct = (req, res, next) => {
    const id = req.params.id;
    Product.show(id).then(([product, fileData]) => {
        Cart.deleteProduct(id, product.price);
    }).catch(err => console.log(err));
    res.redirect('/cart');
}

