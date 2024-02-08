const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Model de usuário
require('../models/Usuario');
const Usuario = mongoose.model('usuarios');

module.exports = function(passport) {
    passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        Usuario.findOne({email: email}).then((usuario) => {
            if (!usuario) {
                return done(null, false, {message: 'Invalid email'});
            }

            bcrypt.compare(password, usuario.password, (error, match) => {
                if (match) {
                    return done(null, usuario)
                } else {
                    return done(null, false, {message: 'Incorrect password'});
                }
            });
        }).catch((err) => {

        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id)
    });

    passport.deserializeUser((id, done) => {
        Usuario.findById(id).then(user => {
                done(null, user)
             }).catch(err => done(err))
   });
};