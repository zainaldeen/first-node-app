const path = require('path');
const express = require('express');
const router = express.Router();

const routeDir = require('../utils/path');
const adminData = require('./admin');


router.get('/', (req, res,next) => {
    const products = adminData.products;
    res.render('shop', {pageTitle: 'Shop', prods: products, path: '/'});
})

module.exports = router;
