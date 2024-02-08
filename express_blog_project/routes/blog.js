const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Model de postagens
require('../models/Postagem');
const Postagem = mongoose.model("postagens");

//Model de categorias
require('../models/Categoria');
const Categoria = mongoose.model("categorias");

//Model de usuários
require('../models/Usuario');
const Usuario  = mongoose.model("usuarios");

//Helpers

const { checkAuthenticated } = require('../helpers/checkAuthenticated');

//Show all recent posts

router.get('/', (request, response) => {
    Postagem.find().populate('category').populate('postedBy').sort({date: 'desc'}).then((postagens) => {
        response.render('blog/index', {postagem: postagens});
    }).catch((err) => {
        console.log('Unable to return post data: ' + err);
        request.flash('error_msg', 'Unable to return post data');
        response.redirect('/');
    });
});

router.get('/post/:id', checkAuthenticated, (request, response) => {
    Postagem.findOne({_id: request.params.id}).populate('category').then((postagem) => {
        response.render('blog/readpostrecent', {postagem: postagem});
    }).catch((err) => {
        console.log('Error loading post ' + request.params.id + ': ' + err);
        request.flash('error_msg', "The post don't exist");
        response.redirect('/');
    });
});

router.get('/postagens/:id', checkAuthenticated, (request, response) => {
    Postagem.findOne({_id: request.params.id}).populate('category').then((postagem) => {
        response.render('blog/readpostrandom', {postagem: postagem});
    }).catch((err) => {
        console.log('Error loading post ' + request.params.id + ': ' + err);
        request.flash('error_msg', "The post don't exist");
        response.redirect('/postagens');
    });
});

router.get('/addpostagem', checkAuthenticated, (request, response) => {
    Categoria.find().then((categorias) => {
        Usuario.findOne({_id: request.user._id}).then((usuario) => {
            response.render('blog/addpost', {categorias: categorias, usuario: usuario});
        }).catch((err) => {
            console.log('Internal server error: ' + err);
            request.flash('error_msg', 'Internal server error');
            response.redirect('/');
        });
    }).catch((err) => {
        console.log('Internal server error: ' + err);
        request.flash('error_msg', 'Internal server error');
        response.redirect('/');
    });
});

router.post('/addpostagem', checkAuthenticated, (request, response) => {
    var errors = [];

    if(!request.body.title || typeof request.body.title == undefined || request.body.title == null) {
        errors.push({text: 'Invalid title'});
    };
    if(!request.body.slug || typeof request.body.slug == undefined || request.body.slug == null) {
        errors.push({text: 'Invalid slug'});
    };
    if(!request.body.description || typeof request.body.description == undefined || request.body.description == null) {
        errors.push({text: 'Invalid description'});
    };
    if(!request.body.content || typeof request.body.content == undefined || request.body.content == null) {
        errors.push({text: 'Invalid content'});
    };
    if(request.body.category == 0) {
        errors.push({text: 'Invalid category'});
    };
    if(errors.length > 0) {
        response.render('admin/postagens/addpostagem', {error: errors});
    } else {
        const newPost = {
            title: request.body.title,
            slug: request.body.slug,
            description: request.body.description,
            content: request.body.content,
            category: request.body.category,
            postedBy: request.body.postedBy
        };

        new Postagem(newPost).save().then(() => {
            console.log('Post added successfully!');
            request.flash('success_msg', 'Post added successfully!');
            response.redirect('/admin/postagens');
        }).catch((err) => {
            console.log('Error when registering a new post: ' + err);
            request.flash('error_msg', 'Error when registering a new post: ' + err);
            response.redirect('/admin/postagens');
        });
    };
});

//Filter posts by category

router.get('/categorias', checkAuthenticated, (request, response) => {
    Categoria.find().then((categoria) => {
        response.render('blog/categorias/categorias', {categoria: categoria});
    }).catch((err) => {
        console.log('Internal server error: ' + err);
        request.flash('error_msg', 'Internal server error');
        response.redirect('/');
    });
});

router.get('/categorias/:slug', checkAuthenticated, (request, response) => {
    Categoria.findOne({slug: request.params.slug}).then((categoria) => {
       if (categoria) {
            Postagem.find({category: categoria._id}).populate('category').populate('postedBy').sort({date: 'desc'}).then((postagens) => {
                response.render('blog/categorias/categoriapostagem', {postagens: postagens, categoria: categoria});
            }).catch((err) => {
                console.log('Unable to find posts in this category: ' + err);
                request.flash('error_msg', 'Unable to find posts in this category');
                response.redirect('/categorias');
            });
       } else {
            request.flash('error_msg', 'Unable to find posts in this category');
            response.redirect('/categorias');
       }
    }).catch((err) => {
        console.log('Internal server error: ' + err);
        request.flash('error_msg', 'Internal server error');
        response.redirect('/categorias');
    });
});

router.get('/categorias/:slug/:id', checkAuthenticated, (request, response) => {
    Categoria.findOne({slug: request.params.slug}).then((categoria) => {
        if (categoria) {
            Postagem.findOne({_id:  request.params.id}).populate('category').populate('postedBy').then((postagem) => {
                response.render('blog/categorias/readcategoriapostagem', {postagem: postagem});
            }).catch((err) => {
                console.log('Unable to find post: ' + err);
                request.flash('error_msg', 'Unable to find post');
                response.redirect('/categorias');
            });
        } else {
            request.flash('error_msg', 'Unable to find post');
            response.redirect('/categorias');
        };
    }).catch((err) => {
        console.log('Internal server error: ' + err);
        request.flash('error_msg', 'Internal server error');
        response.redirect('/categorias');
    });
});

module.exports = router;