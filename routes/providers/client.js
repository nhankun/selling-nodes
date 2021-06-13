var express = require('express');
var router = express.Router();

// controller
const ClientController = require('../../app/controllers/providers/ClientController');

router.get('/', function(req, res){
    res.render('providers/dashboard');
});

/* GET all basic-infos. */
router.get('/clients', ClientController.index);

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

module.exports = router;
