var express = require('express');
var router = express.Router();

// controller
const ManageProviderController = require('../../app/controllers/admin/ManageProviderController');

/* GET all categories. */
router.get('/providers', ManageProviderController.index);

/* delete categories */
router.delete('/providers/:id', ManageProviderController.delete);

router.post('/providers/:id/publish', ManageProviderController.publish);
router.delete('/providers/:id/publish', ManageProviderController.unPublish);

module.exports = router;
