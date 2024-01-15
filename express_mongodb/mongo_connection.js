const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/testandoMongo").then(function () {
    console.log("Conexão com o banco de dados MongoDb realizada com sucesso");
}).catch(function (erro) {
    console.log("Erro ao realizar a conexão com o banco de dados mongoDb: " + erro);
});

const UserSchema = mongoose.Schema({

    nome: {
        type: String,
        require: true
    },
    sobrenome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    idade: {
        type: Number,
        require: true
    }

});

mongoose.model('users', UserSchema);

const newUser = mongoose.model('users');

new newUser({
    nome: "Willyan",
    sobrenome: "Paproski",
    email: "willyanpaproski123@gmail.com",
    idade: 17
}).save().then(
    () => console.log("Usuário cadastrado com sucesso")
).catch(
    (erro) => console.log("Não foi possível cadastrar o usuário: " + erro)
);