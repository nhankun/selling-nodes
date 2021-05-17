var express = require('express');
var router = express.Router();
var providersRouter = require('./providers/clients');

router.use('/', providersRouter);

module.exports = router;
