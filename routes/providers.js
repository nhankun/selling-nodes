var express = require('express');
var router = express.Router();
var providersRouter = require('./providers/basic-infos');
// controller
const ClientController = require('../app/controllers/providers/ClientController');
const ProductController = require('../app/controllers/providers/ProductController');

router.use('/', providersRouter);

// CLIENT ROUTER
router.get('/', function(req, res){
    res.render('providers/dashboard');
});

/* GET all basic-infos. */
// router.get('/clients', ClientController.index);

router.get('/clients/:id/index', ClientController.getClient);

/* create view basic-infos. */
router.get('/clients/create', ClientController.create);

/* store basic-infos */
router.post('/clients',  ClientController.store);

/* view edit basic-infos */
router.get('/clients/:id/edit', ClientController.edit);

/* update basic-infos */
router.put('/clients/:id/update', ClientController.update);

/* delete basic-infos */
router.delete('/clients/:id', ClientController.delete);

/* Delete images of client */
router.delete('/clients/:id/images', ClientController.deleteImage)
// END CLIENT ROUTER

// PRODUCT ROUTER
/* GET all. */
router.get('/products', ProductController.index);

/* create view. */
router.get('/products/create', ProductController.create);

/* store */
router.post('/products',  ProductController.store);

/* view edit  */
router.get('/products/:id/edit', ProductController.edit);

/* update */
router.put('/products/:id/update', ProductController.update);

/* delete */
router.delete('/products/:id', ProductController.delete);

router.post('/products/:id/publish', ProductController.publish);
router.delete('/products/:id/publish', ProductController.unPublish);

/* Delete images of client */
// router.delete('/products/:id/images', ProductController.deleteImage)

/**
 * get sub category by category id
 */
router.get('/products/:category_id/sub-category', ProductController.getSubCategoryByCategoryId)
// END PRODUCT ROUTER

module.exports = router;
