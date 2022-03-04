const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const adminController = require('../controllers/admin');


//
router.get('/add-product', isAuth, adminController.getAddProduct);
router.post('/add-product', isAuth, adminController.postAddProduct);
router.get('/products', isAuth, adminController.getAdminProducts);
router.get('/edit-product/:id', isAuth, adminController.getEditProduct)
router.post('/edit-product/:id', isAuth, adminController.updateProduct);
router.post('/delete-product/:id', isAuth, adminController.deleteProduct);
module.exports = router;
