import express from "express";
import ProductRouter from "./router/product.routes.js"
import CartRouter from "./router/carts.routes.js";
import { engine } from "express-handlebars";
import __dirname from "./utils.js"
import * as path from "path"
import ProductManager from "./controllers/ProductManager.js";
import { Server } from "socket.io";
import ViewRouter from "./router/views.routes.js";

const app = express()
const PORT = 8080
const WS_PORT = 3000
const httpServer = app.listen(WS_PORT, () => {
    console.log(`Servidor Socket.io iniciado en puerto ${WS_PORT}`)
})
const wss = new Server(httpServer, {
    cors: {
        origin: "http://localhost:8080"
      }
})
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

/*app.get("/", async (req, res) => {
    let prod = await product.getProductsById(req.params.id)
    res.render("prod", {
        title: "Express Avanzado | Handlebars",
        products: prod
    })
})*/

// eventos websocket
wss.on('connection', (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`);
    socket.emit('server_confirm', 'Conexion recibida');

  socket.on('disconnect', (reason) => {
    console.log(`Cliente desconectado (${socket.id}): ${reason}`);
  })

  //escuchamos eventos desde el cliente
  socket.on('solicitud_client', (data) => {
    console.log(data);
  })
});


app.use("/api/product", ProductRouter) 
app.use("/api/cart", CartRouter)
app.use('/realtimeproducts', ViewRouter);

app.listen(PORT, () =>{
    console.log(`Servidor Express iniciado en Puerto ${PORT}`)
})