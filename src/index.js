
import {} from 'dotenv/config'
import express from "express";
import ProductRouter from "./router/product.routes.js"
import CartRouter from "./router/carts.routes.js";
import { engine } from "express-handlebars";
import cookieParser from 'cookie-parser';
import session from 'express-session';
import FileStore from 'session-file-store';
import __dirname from "./utils.js"
import * as path from "path"
import Products from "./controllers/ProductManager.js";
import { Server } from "socket.io";
import ViewRouter from "./router/views.routes.js";
import http from 'http';
import mongoose from "mongoose";
import UsersRouter from './router/users.routes.js';
import mainRoutes from './router/main.routes.js';


const app = express()
const PORT = parseInt(process.env.PORT) || 3000;
const MONGOOSE_URL = process.env.MONGOOSE_URL || 'mongodb://127.0.0.1';
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
        credentials: false
    }
});
const product = new Products();


app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.use(cookieParser(COOKIE_SECRET));

// sesiones
const fileStorage = FileStore(session);

const store = new fileStorage({ path: `${__dirname}/sessions`, ttl: 3600, retries: 0 });
app.use(session({
    store: store,
    secret: COOKIE_SECRET,
    resave: false,
    saveUninitialized: false
}));

//estructura handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views") )

app.use("/", express.static(__dirname + "/public"))

// eventos websocket
io.on('connection', (socket) => { 
    console.log(`Cliente conectado (${socket.id})`);
    
    socket.emit('server_confirm', 'Conexión recibida');
    
    socket.on('new_product_in_cart', (data) => {;
        io.emit('product_added_to_cart', data);
    });
    
    socket.on("disconnect", (reason) => {
        console.log(`Cliente desconectado (${socket.id}): ${reason}`);
    });
});


app.use("/api/product", ProductRouter(io)) 
app.use("/api/cart", CartRouter)
app.use('/realtimeproducts', ViewRouter);
app.use('/api', UsersRouter(io));
app.use('/', mainRoutes(io, store, `http://localhost:${PORT}`, 10));

try {
    await mongoose.connect(MONGOOSE_URL);
    server.listen(PORT, () => {
        console.log(`Servidor API/Socket.io iniciado en puerto ${PORT}`);
    });

} catch(err) {
    console.log('No se puede conectar con el servidor de bbdd');
}