const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const Post = require('./models/Posts');
const { where } = require('sequelize');
const app = express();

//Configuração do body-parser

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Configuração do Handlebars

app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,

        allowProtoMethodsByDefault: true,
    }
}));

app.set('view engine', 'handlebars');

//rotas

app.get('/', function (req, res) {
    Post.findAll({order: [['id', 'DESC']]}).then(function (posts) {
        res.render('index', {posts: posts});
    }).catch(function (erro) {
        console.log('Não foi possivel retornar os dados do banco de dados: ' + erro);
    });
});

app.get('/cad', function (req, res) {
    res.render('formulario');
});

app.post('/cad', function (req, res) {
    Post.create({
        titulo: req.body.titulo,
        conteudo: req.body.conteudo
    }).then(function () {
        console.log('Formulário enviado');
        console.log('Dados do formulário cadastrados com sucesso');
        res.redirect('/');
    }).catch(function (erro) {
        console.log('Não foi possivel cadastrar os dados do formulário: ' + erro);
        res.redirect('/');
    });
});

app.get('/deletar/:id', function (req, res) {
    Post.destroy({where: {'id': req.params.id}}).then(function () {
        console.log('A postagem com o id ' + req.params.id + ' foi deletada com sucesso!');
        res.redirect('/');
    }).catch(function (erro) {
        console.log('Não foi possivel deletar a postagem com o id ' + req.params.id + ': ' + erro);
    });
});

app.listen(8080, function () {
    console.log('Servidor rodando na porta 8080');
});