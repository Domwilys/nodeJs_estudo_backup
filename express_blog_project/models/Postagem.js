const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Postagem = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: true
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model("postagens", Postagem);