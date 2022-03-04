const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

const shopController = require('../controllers/shop');
//
router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:id', shopController.getProductById);
router.get('/cart', isAuth, shopController.getCartPage);
router.post('/cart', isAuth, shopController.addToCart);
router.post('/delete-cart/:id', isAuth, shopController.deleteCartProduct);
router.post('/submit-cart', isAuth, shopController.postOrder);
router.get('/order', isAuth, shopController.fetchOrders);
module.exports = router;
