//Importação de módulos
const router = require('express').Router();
const serviceController = require('../controllers/serviceController');

//Rotas
router.route('/services').post((req, res) => serviceController.create(req, res));
router.route('/services').get((req, res) => serviceController.getAll(req, res));
router.route('/services/:id').get((req, res) => serviceController.getOne(req, res));
router.route('/services/:id').delete((req, res) => serviceController.delete(req, res));
router.route('/services/:id').put((req, res) => serviceController.update(req, res));

module.exports = router;