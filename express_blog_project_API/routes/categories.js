//Importação de módulos
const router = require('express').Router();
const categoryController = require('../controllers/categoryController');

router.route('/category').post((req, res) => categoryController.create(req, res));
router.route('/category').get((req, res) => categoryController.getAll(req, res));
router.route('/category/:id').get((req, res) => categoryController.getOne(req, res));
router.route('/category/:id').delete((req, res) => categoryController.delete(req, res));
router.route('/category/:id').put((req, res) => categoryController.update(req, res));

module.exports = router;