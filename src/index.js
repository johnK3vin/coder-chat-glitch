import express from "express";
import multer from "multer";
//rutas
import prodsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";

//handlebers
import {engine} from 'express-handlebars';

import { __dirname } from "./path.js";
import path from 'path';

import { Server } from "socket.io";

const PORT = 8080;
const app = express();

//config de multer utilizando diskStorage
const storage = multer.diskStorage({
    //destination se utiliza para determinar en que carpeta se almacenara los archivos subidos
    destination: (req, file, cb) => {
        //callbacks
        cb(null, 'src/public/img')
    },
    //filename es usado para determinar como deberia ser nombrado el archivo de la carpeta.
    filename: (res, file, cb) =>{
        cb(null, `${Date.now()}${file.originalname}`)
    }
})

const server = app.listen(PORT, ()=>{
    console.log(`Server on port ${PORT}`)
})



//middlaware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/static', express.static(path.join(__dirname, '/public')))

//configuracion para trabajar con handlebars
app.engine('handlebars', engine())//defino el motor de plantilla
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))//resolver rutas absolutas a traves de rutas relativas

//multer
const upload = multer({storage: storage})

 
//server socket.io
const io = new Server(server);
const mensaje = [];

//establecer conexion
io.on('connection', (socket) => {
    console.log("Servidos Socket.io conectado")
    //esperando un 'mensaje'
    socket.on('mensaje', (user)=>{
        if(user.rol === 'admin'){
            socket.emit('credencialesConexion', "usuario valido")
        }else{
            socket.emit('credencialesConexion', "usuario no valido")
        }
    })

    socket.on('mensaje' , (infoMensaje) =>{
        console.log(infoMensaje)
        mensaje.push(infoMensaje)
        socket.emit("mensajes", mensaje)
    })
})

//Routers
app.use('/api/products', prodsRouter)
app.use('/api/carts', cartRouter)


app.get('/static', (req, res) =>{

    res.render('chat', {
        css : "style.css",
        title : "chat",
    })
})


app.post('/upload',  upload.single('product'),(req, res) =>{
    console.log(req.file)
    console.log(req.body)
})
