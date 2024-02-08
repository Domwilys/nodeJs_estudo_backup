//Importação de módulos
const mongoose = require('mongoose');
const { Schema } = mongoose;

//Importação do model de services
const { serviceSchema } = require('./Service');

//Definição dos campos da model de festa
const partySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    services: {
        type: [serviceSchema]
    }
}, {timestamps: true}
);

//Criação do model de festa
const Party = mongoose.model('Party', partySchema);

module.exports = Party;