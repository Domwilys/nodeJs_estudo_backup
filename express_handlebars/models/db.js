const Sequelize = require('sequelize');

const sequelize = new Sequelize('postagens', 'will', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate().then(function () {
    console.log('Conexão com o banco de dados realizada com sucesso');
}).catch(function (erro) {
    console.log('Não foi possível realizar a conexão com o banco de dados: ' + erro);
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
};