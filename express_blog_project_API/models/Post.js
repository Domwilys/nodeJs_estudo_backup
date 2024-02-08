const mongoose = require('mongoose');
const { Schema } = mongoose;

//Definição da model de postagens

const postSchema = new Schema({
    title: {
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
        ref: "Category",
        required: true
    },
}, {timestamps: true});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;