var http = require('http');

http.createServer(function (req, res) {

    res.end("Olá");

}).listen(8080);

console.log("Servidor funcionando com sucesso!")