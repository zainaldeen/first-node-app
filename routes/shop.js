const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');
//
router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:id', shopController.getProductById);
router.get('/cart', shopController.getCartPage);
router.post('/cart', shopController.addToCart);
router.post('/delete-cart/:id', shopController.deleteCartProduct);
router.post('/submit-cart', shopController.postOrder);
router.get('/order', shopController.fetchOrders);
module.exports = router;
