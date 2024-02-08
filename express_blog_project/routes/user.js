const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Importação do model de usuários
require('../models/Usuario');
const Usuario = mongoose.model('usuarios');

//Helpers

const { checkAuthenticated } = require('../helpers/checkAuthenticated');

//Conta do usuário

router.get('/meu-perfil', checkAuthenticated, (request, response) => {
    Usuario.findOne({_id: request.user._id}).then((usuario) => {
        response.render('user/perfil', {usuario: usuario});
    }).catch((err) => {
        console.log('Internal server error: ' + err);
        request.flash('error_msg', 'Internal server error');
        response.redirect('/');
    });
});

router.post('/edit-profile-data', checkAuthenticated, (request, response) => {
    Usuario.findOne({_id: request.body.id}).then((usuario) => {
        usuario.name = request.body.name
        usuario.email = request.body.email

        usuario.save().then(() => {
            console.log('User ' + request.body.id + ' data edited successfully!');
            request.flash('success_msg', 'Data edited successfully!');
            response.redirect('/user/meu-perfil');
        }).catch((err) => {
            console.log('User ' + request.body.id + ' failed to edit their data: ' + err);
            request.flash('error_msg', 'Error when editing data');
            response.redirect('/user/meu-perfil');
        });

    }).catch((err) => {
        console.log('Internal server error: ' + err);
        request.flash('error_msg', 'Internal server error');
        response.redirect('/');
    });
});

//Registro do usuário

router.get('/registro', (request, response) => response.render('user/registro'));

router.post('/registro', (request, response) => {
    var errors = [];

    //Verificação do nome do usuário
    if (!request.body.name || typeof request.body.name == undefined || request.body.name == null) {
        errors.push({text: 'Invalid name'});
    }

    //Verificação do email do usuário
    if (!request.body.email || typeof request.body.email == undefined || request.body.email == null) {
        errors.push({text: 'Invalid email'});
    }

    //Verificação da senha do usuário
    if (!request.body.password || typeof request.body.password == undefined || request.body.password == null) {
        errors.push({text: 'Invalid password'});
    }

    if (request.body.password.length < 6) {
        errors.push({text: 'Your password cannot be shorter than 6 characters'});
    }

    if (!request.body.confirm_password || typeof request.body.confirm_password == undefined || request.body.confirm_password == null || request.body.confirm_password != request.body.password) {
        errors.push({text: 'Passwords do not match'});
    }

    //Verificação de erros
    if (errors.length > 0) {
        response.render('user/registro', {error: errors});
    } else {
        Usuario.findOne({email: request.body.email}).then((usuario) => {
            if (usuario) {
                request.flash('error_msg', 'E-mail already registered');
                response.redirect('/user/registro');
            } else {
                const newUser = new Usuario({
                    name: request.body.name,
                    email: request.body.email,
                    password: request.body.password
                });

                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if (error) {
                            request.flash('error_msg', 'Internal server error');
                            response.redirect('/user/registro');
                        } 

                        newUser.password = hash;

                        newUser.save().then(() => {
                            request.flash('success_msg', 'Successfully registered');
                            response.redirect('/');
                        }).catch((err) => {
                            console.log('Error when registering: ' + err);
                            request.flash('error_msg', 'Error when registering');
                            response.redirect('/user/registro');
                        });
                    });
                });
            }
        }).catch((err) => {
            console.log('Internal server error: ' + err);
            request.flash('error_msg', 'Internal server error');
            response.redirect('/user/registro');
        });
    }
});

//Login do usuário

router.get('/login', (request, response) => response.render('user/login'));

router.post('/login', (request, response, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(request, response, next)
});

//Logout

router.get('/logout', (request, response, next) => {
    request.logOut(function (err) {
        if (err) {
            return next(err);
        }
        request.flash('success_msg', 'Logout successfully!');
        response.redirect('/');
    });
});

module.exports = router