const express = require('express');
const app = express();

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/html/index.html');
});

app.get('/blog', function (req, res) {
    res.send('Seja bem vindo ao meu blog!');
});

app.get('/sobre/:nome/:cargo/:cor', function (req, res) {
    res.send('Nome: ' + req.params.nome + '<br>' + 'Cargo: ' + req.params.cargo + '<br>' + 'Cor favorita: ' + req.params.cor);
});

app.listen(8080, function () {
    console.log('Servidor rodando na porta 8080');
});