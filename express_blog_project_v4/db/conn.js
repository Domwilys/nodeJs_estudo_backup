//Importação de módulos
const mongoose = require('mongoose');

//Importação das variáveis de ambiente
require('dotenv').config();

async function main() {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.log(`Unable to connect to database: ${error}`);
    }
}

module.exports = main