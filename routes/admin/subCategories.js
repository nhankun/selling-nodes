var express = require('express');
var router = express.Router();

// controller
const SubCategoryController = require('../../app/controllers/admin/SubCategoryController');

/* GET all sub categories. */
router.get('/sub-categories', SubCategoryController.index);

/* create view sub category. */
router.get('/sub-categories/create', SubCategoryController.create);

/* create sub-category data in Elasticsearch from MongoDB */
router.get('/sub-categories/createIndexElasticsearch', SubCategoryController.createIndex);

/* store sub category */
router.post('/sub-categories',  SubCategoryController.store);

/* view edit sub category */
router.get('/sub-categories/:id/edit', SubCategoryController.edit);

/* update sub category */
router.put('/sub-categories/:id/update', SubCategoryController.update);


/* delete sub category */
router.delete('/sub-categories/:id', SubCategoryController.delete);

/* publish sub category */
router.post('/sub-categories/:id/publish', SubCategoryController.publish);
router.delete('/sub-categories/:id/publish', SubCategoryController.unPublish);

module.exports = router;
