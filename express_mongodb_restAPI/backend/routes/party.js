//Importação de módulos
const router = require('express').Router();
const partyController = require('../controllers/partyController');

//Rotas
router.route('/party').post((req, res) => partyController.create(req, res));
router.route('/party').get((req, res) => partyController.getAll(req, res));
router.route('/party/:id').get((req, res) => partyController.getOne(req, res));
router.route('/party/:id').delete((req, res) => partyController.delete(req, res));
router.route('/party/:id').put((req, res) => partyController.update(req, res));

module.exports = router