var express = require('express');
var router = express.Router();

// controller
const BasicInfoController = require('../../app/controllers/providers/BasicInfoController');

router.get('/', function(req, res){
    res.render('providers/dashboard');
});

/* GET all basic-infos. */
router.get('/basic-infos', BasicInfoController.index);

/* create view basic-infos. */
router.get('/basic-infos/create', BasicInfoController.create);

/* store basic-infos */
router.post('/basic-infos',  BasicInfoController.store);

/* view edit basic-infos */
router.get('/basic-infos/:id/edit', BasicInfoController.edit);

/* update basic-infos */
router.put('/basic-infos/:id/update', BasicInfoController.update);

/* delete basic-infos */
router.delete('/basic-infos/:id', BasicInfoController.delete);

router.post('/basic-infos/:id/publish', BasicInfoController.publish);
router.delete('/basic-infos/:id/publish', BasicInfoController.unPublish);

/* Delete images of client */
router.delete('/basic-infos/:id/images', BasicInfoController.deleteImage)

module.exports = router;
