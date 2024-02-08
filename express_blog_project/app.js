//Módulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();

//Importação de rotas
const admin = require('./routes/admin');
const blog = require('./routes/blog');
const user = require('./routes/user');

const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

//Módulos do passport
const passport = require('passport');
require('./config/auth')(passport);

//Configurações

//Configuração de sessão
app.use(session({
    secret: 'seguedo',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Middleware e variáveis globais
app.use((request, response, next) => {
    response.locals.success_msg = request.flash('success_msg');
    response.locals.error_msg = request.flash('error_msg');
    response.locals.error = request.flash('error');
    response.locals.user = request.user || null;
    next();
});

//Configuração do Body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Configuração do Handlebars
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,

        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', 'handlebars');

//Configuração de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

//Configuração do mongoose
mongoose.Promise = global.Promise;
mongodbURI = process.env.MONGODB_URI;
mongoose.connect(mongodbURI).then(
    () => console.log('Conexão com o MongoDB realizada com sucesso!')
).catch(
    (err) => console.log('Erro ao realizar a conexão com o MongoDB: ' + err) 
);

//Rotas

app.use('/', blog);
app.use('/admin', admin);
app.use('/user', user);

//Porta do servidor
const port = process.env.APP_PORT;
app.listen(port, () => console.log('Servidor rodando na porta 8585'));