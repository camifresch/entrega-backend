import { Router } from "express";
import __dirname from "../utils.js";
import ProductManager from "../controllers/ProductManager.js";

const viewRouter = Router()
const productManager = new ProductManager((`${__dirname}/../src/models/products.json`))

viewRouter.get('/', async (req, res) => {
    try {
      const productos = await productManager.getProducts( req.query.limit || 0 ); 
      res.render('realTimeProducts', {products: productos });
    } catch(error) {
      res.status(500).send({ error: 'Error al intentar obtener los productos' })
    } 
});

export default viewRouter;