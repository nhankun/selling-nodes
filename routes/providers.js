var express = require('express');
var router = express.Router();
var providersRouter = require('./providers/basic-infos');
var productsRouter = require('./providers/products');
var clientRouter = require('./providers/client');

router.use('/', providersRouter);
router.use('/', productsRouter);
router.use('/', clientRouter);

module.exports = router;
