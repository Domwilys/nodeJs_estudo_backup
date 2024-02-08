const mongoose = require('mongoose');
const Schema = mongoose.Schema

const Usuario = new Schema({
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
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('usuarios', Usuario);