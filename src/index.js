import express from "express";
import ProductRouter from "./router/product.routes.js"
import CartRouter from "./router/carts.routes.js";
import { engine } from "express-handlebars";
import __dirname from "./utils.js"
import * as path from "path"
import ProductManager from "./controllers/ProductManager.js";
import { Server } from "socket.io";
import ViewRouter from "./router/views.routes.js";
import http from 'http';


const app = express()
const PORT = 3000
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
        credentials: false
    }
});
const product = new ProductManager();


app.use(express.json())
app.use(express.urlencoded({extended: true}));

//estructura handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views") )

app.use("/", express.static(__dirname + "/public"))

app.get("/", async (req, res) => {
    let allProducts = await product.getProducts()
    res.render("index", {
        title: "Express Avanzado | Handlebars",
        products: allProducts
    })
})

// eventos websocket
io.on('connection', (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`);
    socket.emit('server_confirm', 'Conexion recibida');

    socket.on('new_message', (data) => {;
      io.emit('msg_received', data);
  });
  
  socket.on("disconnect", (reason) => {
      console.log(`Cliente desconectado (${socket.id}): ${reason}`);
  });
});


app.use("/api/product", ProductRouter(io)) 
app.use("/api/cart", CartRouter)
app.use('/realtimeproducts', ViewRouter);

server.listen(PORT, () => {
  console.log(`Servidor API/Socket.io iniciado en puerto ${PORT}`);
});
