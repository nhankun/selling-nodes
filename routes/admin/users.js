var express = require('express');
var router = express.Router();

// controller
const ManageUserController = require('../../app/controllers/admin/ManageUserController');

/* GET users listing. */
router.get('/users', ManageUserController.index);

router.get('/users/create', ManageUserController.create);

router.post('/users',  ManageUserController.store);

router.get('/users/:id/edit', ManageUserController.edit);

router.put('/users/:id/update', ManageUserController.update);

router.delete('/users/:id', ManageUserController.delete);

router.post('/users/:id/publish', ManageUserController.publish);
router.delete('/users/:id/publish', ManageUserController.unPublish);


module.exports = router;
