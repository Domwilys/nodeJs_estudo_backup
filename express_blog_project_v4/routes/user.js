//Importação de módulos
const router = require('express').Router();
const userController = require('../controllers/userController');

//Registro do usuário
router.route('/user').get((req, res) => res.send('Userdadbaas'));
router.route('/user/register').get((req, res) => res.render('users/register'));
router.route('/user/register').post((req, res) => userController.create(req, res));

module.exports = router;