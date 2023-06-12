import {Router} from "express";
import Products from ".././controllers/ProductManager.js";


const ProductRouter = (io) => {
    const router = Router();
    const product = new Products();
    
    router.get('/?', async (req, res) => {
        try {
            const { query, limit, page, sort } = req.query;
            const products = await manager.getProducts(query, limit, page, sort);
            res.status(200).send({ data: products });
        } catch (err) {
            res.status(500).send({ error: err });
        }
    });

    router.get('/:pid', async (req, res) => {
        try {
            const id = req.params.pid;
            const product = await manager.getProductById(id);
            res.status(200).send({ status: 'OK', data: product });
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err });
        }
    });

router.post('/', async (req, res) => {
    const {
        title,
        description,
        code,
        price,
        stock,
    } = req.body;
    const product = {
        title,
        description,
        code,
        price,
        stock,
    };
    await manager.addProduct(product);

    if (manager.checkStatus() === 1) {
        res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
    } else {
        res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
    }
});

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