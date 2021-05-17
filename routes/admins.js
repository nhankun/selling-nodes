var express = require('express');
var router = express.Router();
var categoriesRouter = require('./admin/categories');
var subCategoriesRouter = require('./admin/subCategories');
var usersRouter = require('./admin/users');
var manageProviderRouter = require('./admin/providers');
var manageUserRouter = require('./admin/users');

router.get('/', function(req, res){
    res.render('admins/dashboard');
});


router.use('/users', usersRouter);
router.use('/settings/', categoriesRouter);
router.use('/settings/', subCategoriesRouter);

router.use('/manage/', manageProviderRouter)
router.use('/manage/', manageUserRouter)

module.exports = router;
