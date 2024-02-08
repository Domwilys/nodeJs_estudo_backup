//Importação de módulos
const mongoose = require('mongoose');
const CategoryModel = require('../models/Category');

//Importação da variáveis de ambiente
require('dotenv').config();

//Função que semea o banco de dados
async function seedCategorias() {
    try {
        
        //Conexão com o banco de dados
        mongoose.set('strictQuery', true);
        await mongoose.connect(process.env.MONGODB_URI);

        const numCategory = 30;
        for (let i = 1; i <= numCategory; i++) {
            const categoryData = { name: `Categoria ${i}`, slug: `categoria-${i}` };
            let category = new CategoryModel(categoryData);
            await category.save();
            console.log(`Categoria ${category.name} salva com sucesso`);
        }
        console.log('Seed concluido');
        mongoose.disconnect();
    } catch (error) {
        console.log(`Erro ao semear o banco de dados: ${error}`);
    }
}

seedCategorias();