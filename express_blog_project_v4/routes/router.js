//Importação de módulos
const router = require('express').Router();
const bodyParser = require('body-parser');

//Configurações do body parser
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//Rotas dos usuários
const userRoutes = require('./user');
router.use('/', userRoutes);

//Rotas administrativas
const adminRoutes = require('./admin');
router.use('/', adminRoutes);

module.exports = router;