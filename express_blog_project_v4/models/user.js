//Importação de módulos
const mongoose = require('mongoose');
const { Schema } = mongoose;

//Model de usuários
const userSchema = new Schema({
    admin: {
        type: Number,
        default: 0
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

//Criação da collection no banco de dados
const User = mongoose.model('User', userSchema);

module.exports = User;