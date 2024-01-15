const db = require('./db');

const Post = db.sequelize.define('postagens', {
    titulo: {
        type: db.Sequelize.STRING
    },
    conteudo: {
        type: db.Sequelize.TEXT
    }
});

// Post.sync({force: true}).then(function () {
//     console.log('Tabela de postagens criada com sucesso');
// }).catch(function (erro) {
//     console.log('Não foi possivel criar a tabela de postagens: ' + erro);
// });

module.exports = Post;