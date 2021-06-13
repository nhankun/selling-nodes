var express = require('express');
var router = express.Router();
var homeRouter = require('./front-ends/home');


router.use('/', homeRouter);

module.exports = router;
