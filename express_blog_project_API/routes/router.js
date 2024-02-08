//Importação de módulos
const router = require('express').Router();

//Rotas de categorias
const categoriesRoutes = require('../routes/categories');
router.use('/', categoriesRoutes);

//Rotas de postagens
const postsRoutes = require('../routes/posts');
router.use('/', postsRoutes);

module.exports = router;