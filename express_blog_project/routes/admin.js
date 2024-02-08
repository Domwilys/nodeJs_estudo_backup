const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Model de categorias
require('../models/Categoria');
const Categoria = mongoose.model("categorias");

//Model de postagens
require('../models/Postagem');
const Postagem = mongoose.model("postagens");

//Model de usuários
require('../models/Usuario');
const Usuario = mongoose.model("usuarios");

//Helpers
const { checkAdmin } = require('../helpers/checkAdmin');

router.get('/', checkAdmin, (request, response) => response.render('admin/index'));

//Rotas de categorias
router.get('/categorias', checkAdmin, (request, response) => {
    Categoria.find().sort({date: 'desc'}).then((categorias) => {
        response.render('admin/categorias/categorias', {categoria: categorias});
    }).catch((err) => {
        console.log('Unable to return category data: ' + err);
        request.flash('error_msg', 'Unable to return category data');
        response.redirect('/');
    });
});
router.get('/categorias/add', checkAdmin, (request, response) => response.render('admin/categorias/addcategoria'));
router.post('/categorias/new', checkAdmin, (request, response) => {
    var errors = [];
    if(!request.body.name || typeof request.body.name == undefined || request.body.name == null) {
        errors.push({text: 'Invalid name'});
    };
    if(!request.body.slug || typeof request.body.slug == undefined || request.body.name == null) {
        errors.push({text: 'Invalid slug'});
    };
    if(errors.length > 0) {
        response.render('admin/categorias/addcategoria', {errors: errors});
    } else {
        const newCategory = {
            name: request.body.name,
            slug: request.body.slug
        };
    
        new Categoria(newCategory).save().then(
            () => {
                console.log('Category added successfully!');
                request.flash('success_msg', 'Category added successfully!');
                response.redirect('/admin/categorias');
            }
        ).catch(
            (err) => {
                console.log('Error when registering a new category: ' + err);
                request.flash('error_msg', 'There was an error adding a new category');
                response.redirect('/admin');
            }
        );
    }
});

router.get('/categorias/edit/:id', checkAdmin, (request, response) => {
    Categoria.findOne({_id: request.params.id}).then((categoria) => {
        response.render('admin/categorias/editcategorias', {categoria: categoria});
    }).catch((err) => {
        console.log('Cannot find category with id ' + request.params.id + ': ' + err);
        request.flash('error_msg', "The category don't exist");
        response.redirect('/admin/categorias');
    });
});

router.post('/categorias/edit', checkAdmin, (request, response) => {
    var errors = [];
    if(!request.body.name || typeof request.body.name == undefined || request.body.name == null) {
        errors.push({text: 'Invalid name'});
    };
    if(!request.body.slug || typeof request.body.slug == undefined || request.body.name == null) {
        errors.push({text: 'Invalid slug'});
    };
    if(errors.length > 0) {
        response.render('admin/categorias/editcategorias', {errors: errors});
    } else {
        Categoria.findOne({_id: request.body.id}).then((categoria) => {
            categoria.name = request.body.name;
            categoria.slug = request.body.slug;
    
            categoria.save().then(() => {
                request.flash('success_msg', "Category " + request.body.id + " edited successfully!");
                response.redirect('/admin/categorias');
            }).catch((err) => {
                request.flash('error_msg', "Error editing category " + request.body.id + ": " + err);
                response.redirect('/admin/categorias');
            });
        });
    };
});

router.post('/categorias/deletar', checkAdmin, (request, response) => {
    Categoria.deleteOne({_id: request.body.id}).then(() => {
        request.flash('success_msg', 'Category ' + request.body.id + ' deleted successfully');
        response.redirect('/admin/categorias');
    }).catch((err) => {
        request.flash('error_msg', 'Error when deleting category ' + request.body.id + ': ' + err);
        response.redirect('/admin/categorias');
    });
});

//Rotas de postagens
router.get('/postagens', checkAdmin, (request, response) => {
    Postagem.find().populate('category').populate('postedBy').sort({date: 'desc'}).then((postagem) => {
        response.render('admin/postagens/postagens', {postagem: postagem});
    }).catch((err) => {
        console.log('Unable to return post data: ' + err);
        request.flash('error_msg', 'Unable to return post data');
        response.redirect('/admin');
    });
});

router.get('/readpostagens/:id', checkAdmin, (request, response) => {
    Postagem.findOne({_id: request.params.id}).populate('category').populate('postedBy').then((postagem) => {
        response.render('admin/postagens/readpostagem', {postagem: postagem});
    }).catch((err) => {
        console.log('Error loading post ' + request.params.id + ': ' + err);
        request.flash('error_msg', 'Error loading post ' + request.params.id);
        response.redirect('/admin/postagens');
    });
});

router.get('/postagens/add', checkAdmin, (request, response) => {
    Categoria.find().then((categorias) => {
        Usuario.findOne({_id: request.user._id}).then((usuario) => {
            response.render('admin/postagens/addpostagem', {categorias: categorias, usuario: usuario});
        }).catch((err) => {
            console.log('Internal server error: ' + err);
            request.flash('error_msg', 'Internal server error');
            response.redirect('/admin/postagens');
        });
    }).catch((err) => {
        console.log('Internal server error: ' + err);
        request.flash('error_msg', 'Internal server error');
        response.redirect('/admin/postagens');
    });
});

router.post('/postagens/new', checkAdmin, (request, response) => {
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
        response.render('admin/postagens/addpostagem', {errors: errors});
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

router.get('/postagens/edit/:id', checkAdmin, (request, response) => {
    Postagem.findOne({_id: request.params.id}).then((postagem) => {
        Categoria.find().then((categorias) => {
            response.render('admin/postagens/editpostagens', {categorias: categorias, postagem: postagem});
        }).catch((err) => {
            console.log('Error returning post ' + request.params.id + ' category: ' + err);
            request.flash('error_msg', 'Error returning post ' + request.params.id + ' category');
            response.redirect('/admin/postagens');
        });
    }).catch((err) => {
        console.log('Cannot find the post with id:' + request.params.id + ' : ' + err);
        request.flash('error_msg', "The post don't exist");
        response.redirect('/admin/postagens');
    });
});

router.post('/postagens/edit', checkAdmin, (request, response) => {
    Postagem.findOne({_id: request.body.id}).then((postagem) => {
        postagem.title = request.body.title;
        postagem.slug = request.body.slug;
        postagem.description = request.body.description;
        postagem.content = request.body.content;
        postagem.category = request.body.category;

        postagem.save().then(() => {
            request.flash('success_msg', 'Post ' + request.body.id + ' edited successfully!');
            response.redirect('/admin/postagens');
        }).catch((err) => {
            console.log('Error when editing post ' + request.body.id + ': ' + err);
            request.flash('error_msg', 'Error when editing post ' + request.body.id);
            response.redirect('/admin/postagens');
        });
    }).catch((err) => {
        console.log('Error when editing post ' + request.body.id + ': ' + err);
        request.flash('Error when editing post ' + request.body.id);
        response.redirect('/admin/postagens');
    });
});

router.post('/postagens/deletar', checkAdmin, (request, response) => {
    Postagem.deleteOne({_id: request.body.id}).then(() => {
        console.log('Post ' + request.body.id + ' deleted successfully!');
        request.flash('success_msg', 'Post ' + request.body.id + ' deleted successfully!');
        response.redirect('/admin/postagens');
    }).catch((err) => {
        console.log('Error when deleting post ' + request.body.id + ': ' + err);
        request.flash('error_msg', 'Error when deleting post ' + request.body.id);
        response.redirect('/admin/postagens');
    });
});

//Rotas de dados dos usuários

router.get('/users', checkAdmin, (request, response) => {
    Usuario.find().sort({date: 'desc'}).then((usuarios) => {
        response.render('admin/usuarios/usuarios', {usuario: usuarios});
    }).catch((err) => {
        console.log('Unable to return user data: ' + err);
        request.flash('error_msg', 'Unable to return user data');
        response.redirect('/admin');
    });
});

router.get('/users/add', checkAdmin, (request, response) => response.render('admin/usuarios/adduser'));

router.post('/users/new', checkAdmin, (request, response) => {

    var errors = [];

    if (!request.body.name || typeof request.body.name == undefined || request.body.name == null) {
        errors.push({text: 'Invalid name'});
    }

    if (!request.body.email || typeof request.body.email == undefined || request.body.email == null) {
        errors.push({text: 'Invalid email'});
    }

    if (!request.body.password || typeof request.body.password == undefined || request.body.password == null) {
        errors.push({text: 'Invalid password'});
    }

    if (request.body.password < 6) {
        errors.push({text: 'Your password cannot be shorter than 6 characters'});
    }

    if (request.body.confirm_password != request.body.password) {
        errors.push({text: 'Passwords do not match'});
    } 
    
    if (errors.length > 0) {
        response.render('admin/usuarios/adduser', {error: errors});
    } else {
        const newUser = {
            name: request.body.name,
            email: request.body.email,
            password: request.body.password
        }
    
        new Usuario(newUser).save().then(() => {
            console.log('User added successfully!');
            request.flash('success_msg', 'User added successfully!');
            response.redirect('/admin/users');
        }).catch((err) => {
            console.log('Error registering user: ' + err);
            request.flash('Error registering user');
            response.redirect('/admin/users');
        });
    }

});

//Editar username e email do usuário

router.get('/users/edit/:id', checkAdmin, (request, response) => {
    Usuario.findOne({_id: request.params.id}).then((usuario) => {
        response.render('admin/usuarios/edituser', {usuario: usuario});
    }).catch((err) => {
        console.log('Internal server error: ' + err);
        request.flash('error_msg', 'Internal server error');
        response.redirect('/admin/users');
    });
});

router.post('/users/edit', checkAdmin, (request, response) => {
    Usuario.findOne({_id: request.body.id}).then((usuario) => {
        usuario.name = request.body.name
        usuario.email = request.body.email

        usuario.save().then(() => {
            request.flash('success_msg', 'User edited successfully!');
            response.redirect('/admin/users');
        }).catch((err) => {
            console.log('Error when editing user ' + request.params.id + ' data: ' + err);
            request.flash('Error when editing user ' + request.params.id + ' data:');
            response.redirect('/admin/users');
        });
    }).catch((err) => {
        console.log('Internal server error: ' + err);
        request.flash('error_msg', 'Internal server error');
        response.redirect('/admin/users');
    });
});

//Editar senha do usuário

router.get('/users/edit/password/:id', checkAdmin, (request, response) => {
    Usuario.findOne({_id: request.params.id}).then((usuario) => {
        response.render('admin/usuarios/editpassword', {usuario: usuario});
    }).catch((err) => {
        console.log('Internal server error: ' + err);
        request.flash('error_msg', 'Internal server error');
        response.redirect('/admin/users');
    });
});

router.post('/users/edit/password', checkAdmin, (request, response) => {

    var errors = [];

    if (!request.body.new_password || typeof request.body.new_password == undefined || request.body.new_password == null) {
        errors.push({text: 'Invalid password'});
    };
    
    if (request.body.new_password < 6) {
        errors.push({text: 'The new password cannot be shorter than 6 characters'});
    };

    if (request.body.new_password != request.body.confirm_new_password) {
        errors.push({text: 'Passwords do not match'});
    }; 
    
    if (errors.length > 0) {
        response.render('admin/usuarios/editpassword', {error: errors});
    } else {
        Usuario.findOne({_id: request.body.id}).then((usuario) => {
            bcrypt.genSalt(10, (error, salt) => {
                bcrypt.hash(request.body.new_password, salt, (error, hash) => {
                    if (error) {
                        request.flash('error_msg', 'Internal server error');
                        response.redirect('/admin/users');
                    }
    
                    usuario.password = request.body.new_password
                    usuario.password = hash
    
                    usuario.save().then(() => {
                        console.log('New password registered successfully for user: ' + usuario._id);
                        request.flash('success_msg', 'New password registered successfully!');
                        response.redirect('/admin/users');
                    }).catch((err) => {
                        console.log('Internal server error: ' + err);
                        request.flash('error_msg', 'Internal server error');
                        response.redirect('/admin/users');
                    });
                });
            });
        }).catch((err) => {
            console.log('Internal server error: ' + err);
            request.flash('error_msg', 'Internal server error');
            response.redirect('/admin/users');
        });
    };
});

//Deletar usuário

router.post('/users/deletar', checkAdmin, (request, response) => {
    Usuario.deleteOne({_id: request.body.id}).then(() => {
        console.log('User ' + request.body.id + ' deleted successfully!');
        request.flash('success_msg', 'User ' + request.body.id + 'deleted successfully!');
        response.redirect('/admin/users');
    }).catch((err) => {
        console.log('Error when deleting user ' + request.params.id + ': ' + err);
        request.flash('Error when deleting user ' + request.params.id);
        response.redirect('/admin/users');
    });
});

module.exports = router;