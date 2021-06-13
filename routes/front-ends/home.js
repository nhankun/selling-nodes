var express = require('express');
var router = express.Router();

// controller

router.get('/', function(req, res){
    res.render('front-ends/home');
});

module.exports = router;
