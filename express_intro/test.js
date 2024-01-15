const Sequelize = require('sequelize');
const sequelize = new Sequelize('teste', 'will', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate().then(function () {
    console.log('Conexão com o banco de dados realizada com sucesso!');
}).catch(function (erro) {
    console.log('Erro ao realizar a conexão com o banco de dados: ' + erro);
});

const Postagem = sequelize.define('postagens', {
    titulo: {
        type: Sequelize.STRING
    },
    conteudo: {
        type: Sequelize.TEXT
    }
});

// Postagem.create({
//     titulo: "Aprenda nodejs",
//     conteudo: "Node js é muito legal"
// });

// Postagem.sync({force: true});

const Usuario = sequelize.define('usuarios', {
    nome: {
        type: Sequelize.STRING
    },
    sobrenome: {
        type: Sequelize.STRING
    },
    idade: {
        type: Sequelize.INTEGER
    },
    email: {
        type: Sequelize.STRING
    }
});

// Usuario.create({
//     nome: "Willyan",
//     sobrenome: "Paproski",
//     idade: 17,
//     email: "willyanpaproski123@gmail.com"
// });

// Usuario.sync({force: true});