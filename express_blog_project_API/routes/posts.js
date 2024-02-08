//Importação de módulos
const router = require('express').Router();
const { Router } = require('express');
const postController = require('../controllers/postController');

router.route('/posts').post((req, res) => postController.create(req, res));
router.route('/posts').get((req, res) => postController.getAll(req, res));
router.route('/posts/:id').get((req, res) => postController.getOne(req, res));
router.route('/posts/:id').delete((req, res) => postController.delete(req, res));
router.route('/posts/:id').put((req, res) => postController.update(req, res));

module.exports = router;