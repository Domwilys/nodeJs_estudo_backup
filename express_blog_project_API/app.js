//Importação de módulos
const express = require('express');
const app = express();
const cors = require('cors');

//Importação das variáveis de ambiente
require('dotenv').config();

//Configuração de middlewares
app.use(cors());
app.use(express.json());

//Conexão com o banco de dados
const conn = require('./db/conn');
conn();

//Rotas
const routes = require('./routes/router');
app.use('/api', routes);

//Port bind da aplicação
const port = process.env.APP_PORT
app.listen(port, () => {
    console.log('Servidor online');
});