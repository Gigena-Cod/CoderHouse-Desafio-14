"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _expressHandlebars = require("express-handlebars");

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var http = require("http").Server(app);

var io = require('socket.io')(http);

var moment = _moment2.default;

var handlebars = _expressHandlebars2.default;

var path = _path2.default;

var fs = _fs2.default;

var txtMessages = [];

var ruta = path.join(__dirname, "/routes/Messages.txt");

//IO
io.on('connection', function (socket) {
    //CARGANDO MENSAJES
    var lMessages = JSON.parse(fs.readFileSync(ruta, 'utf-8'));

    socket.join(socket.id);
    io.to(socket.id).emit('lastMessages', lMessages);

    console.log("New user connection " + socket.id);
    //ESCUCHAMOS EVENTO NUEVO PRODUCTO
    socket.on('newProduct', function (object) {
        io.emit('newProduct', object);
    });

    //ESCUCHAMOS EVENTO NUEVO MENSAJE
    socket.on('newMessage', function (data) {

        var now = moment().format();
        data.now = moment(now).format('DD/MM/YYYY HH:MM:SS');
        var newObject = { Autor: data.Autor, Mensaje: data.Mensaje, now: data.now };
        txtMessages.push(newObject);

        //GRABAMOS EL ARCHIVO 
        fs.writeFileSync(ruta, JSON.stringify(txtMessages), 'utf-8');
        io.sockets.emit('newMessage', data);
    });
});

var PORT = '8000';

//INICIAMOS EL SERVIDOR
http.listen(PORT, function () {
    console.log("Escuchando el servidor http://localhost:" + PORT);
});

//URL BASE
app.use('/api', require('./routes/products'));

//CONFIGURACION DE HANDLEBARS
app.engine("hbs", handlebars({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}));

//ESTABLECEMOS EL MOTOR DE PLANTILLA QUE SE UTILIZA
app.set("view engine", "hbs");

//ESTABLECEMOS DIRECTORIOS DONDE SE ENCUENTRAN 
//LOS ARCHIVOS DE PLANTILLAS 
app.set("views", "./views");

//CATCH DE SERVIDOR
process.on('uncaughtException', function (err) {
    if (err.code === 'EADDRINUSE') console.log('Error al iniciar el servidor.El servidor no se ùede iniciar dos vesces');else console.log(err);
});

module.exports = ruta;
