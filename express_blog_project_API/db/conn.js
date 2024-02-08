//Importação de módulos
const mongoose = require('mongoose');

//Importação das variáveis de ambiente
require('dotenv').config();

//Conexão com o banco de dados
async function main() {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database connected successfully!');
    } catch (error) {
        console.log(`Database connection error: ${error}`);
    }
};

module.exports = main;