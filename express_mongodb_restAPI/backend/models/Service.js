//Importação de módulos
const mongoose = require('mongoose');
const { Schema } = mongoose;

//Definição de campos da model de serivços
const serviceSchema  = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, 
{ timestamps: true }
);

//Criação da model de serviços
const Service = mongoose.model('Service', serviceSchema);

module.exports = {
    Service,
    serviceSchema
};