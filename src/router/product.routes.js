import {Router} from "express";
import ProductManager from ".././controllers/ProductManager.js";


const ProductRouter = (io) => {
    const router = Router();
    const product = new ProductManager();
    
    router.get('/products_index', async (req, res) => {
        const products = await manager.getProducts();
        res.render('index_products', {
            products: products
        });
    });

    router.get("/:pid", async (req, res) =>{
    let id = req.params.pid
    res.send(await product.getProductsById(id))
})

    router.post("/", async (req, res) =>{
    let newProduct = req.body
    res.send(await product.addProducts(newProduct))
    io.emit('new_prod', req.body);
})

router.put("/:pid", async (req, res) =>{
    let id = req.params.pid
    let updateProduct = req.body
    res.send(await product.updateProduct(id, updateProduct))
})

router.delete("/:pid", async (req, res) =>{
    let id = req.params.pid
    res.send(await product.deleteProducts(id))
})

return router;
}

export default ProductRouter