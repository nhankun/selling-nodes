var express = require('express');
var router = express.Router();

// controller
const CategoryController = require('../../app/controllers/admin/CategoryController');

/* GET all categories. */
router.get('/categories', function(req, res, next) {
  CategoryController.index(req, res);
});

/* create view categories. */
router.get('/categories/create', function(req, res, next) {
  CategoryController.create(req, res)
});

/* store categories 
uploadImage.fields([{ name: 'banner', maxCount: 1 }, { name: 'icon', maxCount: 8 }]),
*/
router.post('/categories',  CategoryController.store);

/* create sub-category data in Elasticsearch from MongoDB */
router.get('/categories/createIndexElasticsearch',  CategoryController.createIndex);

/* view edit categories */
router.get('/categories/:id/edit', function(req, res, next) {
  CategoryController.edit(req, res)
});

/* update categories */
router.put('/categories/:id/update', CategoryController.update);


/* delete categories */
router.delete('/categories/:id', CategoryController.delete);

router.post('/categories/:id/publish', CategoryController.publish);
router.delete('/categories/:id/publish', CategoryController.unPublish);

module.exports = router;
