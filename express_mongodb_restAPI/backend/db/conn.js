//Importação de módulos
const mongoose = require('mongoose');

//Importação das variáveis de ambiente
require('dotenv').config();

//Conexão com o banco de dados
async function main() {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(process.env.MONGODB_URI); 
        console.log('Conexão com o banco de dados realizada com sucesso');   
    } catch (error) {
        console.log(`Error when connecting to the database: ${error}`);
    };
};

module.exports = main;