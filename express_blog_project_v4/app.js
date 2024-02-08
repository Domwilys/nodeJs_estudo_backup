//Impoortação de módulos
const express = require('express');
const app = express();
const cors = require('cors');
const handlebars = require('express-handlebars');
const path = require('path');

//Configurações de Middlewares
app.use(cors());
app.use(express.json());

//Rotas
const routes = require('./routes/router');
app.use('/', routes);

//Configurações do Handlebars
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,

        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', 'handlebars');

//Conexão com o banco de dados
const conn = require('./db/conn');
conn();

//Configurações de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

//Importação das variáveis de ambiente
require('dotenv').config();

//Port Bind da aplicação
app.listen(process.env.APP_PORT, () => {
    console.log('Servidor online');
});