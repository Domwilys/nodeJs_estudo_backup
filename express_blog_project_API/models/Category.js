//Importação de módulos
const mongoose = require('mongoose');
const { Schema } = mongoose;

//Definição dos campos da model de categorias

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    }
}, {timestamps: true}
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;