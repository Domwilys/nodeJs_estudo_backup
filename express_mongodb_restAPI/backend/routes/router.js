//Importação de módulos
const router = require('express').Router();

//Rotas de serviços
const serviceRouter = require('./service');
router.use('/', serviceRouter);

//Rotas de festa
const partyRouter = require('./party');
router.use('/', partyRouter);

module.exports = router