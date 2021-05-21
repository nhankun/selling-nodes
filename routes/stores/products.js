var express = require('express');
var router = express.Router();

// controller
const ProductController = require('../../app/controllers/stores/ProductController');

router.get('/', function(req, res){
    res.render('providers/dashboard');
});

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

module.exports = router;
