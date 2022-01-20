const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.get('/add-product', adminController.getAddProduct);
router.post('/add-product', adminController.postAddProduct);
router.get('/products', adminController.getAdminProducts);
router.get('/edit-product/:id', adminController.getEditProduct)
router.post('/edit-product/:id', adminController.updateProduct);
router.post('/delete-product/:id', adminController.deleteProduct);
module.exports = router;
