const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
const Categoria = mongoose.model("categorias");

router.get('/', (request, response) => response.render('admin/index'));
router.get('/posts', (request, response) => response.send('Página de posts'));
router.get('/categorias', (request, response) => {
    Categoria.find().sort({date: 'desc'}).then((categorias) => {
        response.render('admin/categorias', {categoria: categorias});
    }).catch((err) => {
        console.log('Não foi possível retornar os dados das categorias do MongoDB: ' + err);
        request.flash('error_msg', 'Unable to load category data');
    });
});
router.get('/categorias/add', (request, response) => response.render('admin/addcategoria'));
router.post('/categorias/new', (request, response) => {
    var errors = [];
    if(!request.body.name || typeof request.body.name == undefined || request.body.name == null) {
        errors.push({text: 'Invalid name'});
    };
    if(!request.body.slug || typeof request.body.slug == undefined || request.body.name == null) {
        errors.push({text: 'Invalid slug'});
    };
    if(errors.length > 0) {
        response.render('admin/addcategoria', {errors: errors});
    } else {
        const newCategory = {
            name: request.body.name,
            slug: request.body.slug
        };
    
        new Categoria(newCategory).save().then(
            () => {
                console.log('Dados do formulário de categorias salvo com sucesso!');
                request.flash('success_msg', 'Category added successfully!');
                response.redirect('/admin/categorias');
            }
        ).catch(
            (err) => {
                console.log('Erro ao cadastrar os dados do formulário de categorias: ' + err);
                request.flash('error_msg', 'There was an error adding a new category');
                response.redirect('/admin');
            }
        );
    }
});

module.exports = router;