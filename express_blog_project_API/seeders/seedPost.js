//Importação de módulos
const mongoose = require('mongoose');
const PostModel = require('../models/Post');

//Importação das variáveis de ambiente
require('dotenv').config();

//Função que semea o banco de dados
async function seedPost() {
    try {
        //Conexão com o banco de dados
        mongoose.set('strictQuery', true);
        await mongoose.connect(process.env.MONGODB_URI);

        const numPost = 50;
        for (let i = 1; i<= numPost; i++) {
            const postData = {
                title: `Titulo da postagem ${i}`,
                description: `Descrição da postagem ${i}`,
                content: `Conteúdo da postagem ${i}`,
                category: '65c22335e205555153d8fd05'
            }
            let post = new PostModel(postData);
            await post.save();
            console.log(`Postagem: ${post.name}\n${post.description}\n${post.content}\n${post.category}`);
        }
        console.log('Seed concluido');
        mongoose.disconnect();
    } catch (error) {
        console.log(`Erro ao semear o banco de dados: ${error}`);
    }
}

seedPost();