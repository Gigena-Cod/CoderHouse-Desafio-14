
const app = require('express')()

const http = require('http').createServer(app)

const io = require('socket.io')(http)

const moment = require('moment')

const handlebars = require('express-handlebars')

const path = require('path')

const fs = require('fs')
const { json } = require('body-parser')

 
let txtMessages = []

let ruta = path.join(__dirname,`/routes/Messages.txt`)



//IO
io.on('connection',(socket)=>{
        //CARGANDO MENSAJES
        const lMessages = JSON.parse(fs.readFileSync(ruta,'utf-8'))
     
        socket.join(socket.id)
        io.to(socket.id).emit('lastMessages',lMessages)
            
      

    console.log(`New user connection ${socket.id}`)
    //ESCUCHAMOS EVENTO NUEVO PRODUCTO
    socket.on('newProduct',(object)=>{
        io.emit('newProduct',object)
    })

    //ESCUCHAMOS EVENTO NUEVO MENSAJE
    socket.on('newMessage',(data)=>{
     
        let now = moment().format();
        data.now = moment(now).format('DD/MM/YYYY HH:MM:SS'); 
        let newObject = {Autor:data.Autor,Mensaje:data.Mensaje,now:data.now}
        txtMessages.push(newObject)
      
        
           
        
        //GRABAMOS EL ARCHIVO 
        fs.writeFileSync(ruta,JSON.stringify(txtMessages),'utf-8')        
         io.sockets.emit('newMessage',data)
    })
})


const PORT = '8000'

//INICIAMOS EL SERVIDOR
http.listen(PORT,() => {
    console.log(`Escuchando el servidor http://localhost:${PORT}`)
})
//URL BASE
app.use('/api',require('./routes/products'))

//CONFIGURACION DE HANDLEBARS
app.engine("hbs",handlebars(
    {
        extname:'.hbs',
        defaultLayout:'index.hbs',
        layoutsDir:__dirname+'/views/layouts',
        partialsDir: __dirname+'/views/partials'
    }
))

//ESTABLECEMOS EL MOTOR DE PLANTILLA QUE SE UTILIZA
app.set("view engine","hbs")

//ESTABLECEMOS DIRECTORIOS DONDE SE ENCUENTRAN 
//LOS ARCHIVOS DE PLANTILLAS 
app.set("views","./views")



//CATCH DE SERVIDOR
process.on('uncaughtException', function(err) {   
    if(err.code === 'EADDRINUSE')
         console.log('Error al iniciar el servidor.El servidor no se ùede iniciar dos vesces');
         
    else
         console.log(err);

}); 

module.exports = ruta