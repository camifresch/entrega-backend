import { Router } from "express";
import CartManager from ".././controllers/CartManager.js";

const CartRouter = Router();
const carts = new CartManager();

CartRouter.post("/", async (req, res) => {
  const addResponse = await manager.addCart();
  !addResponse.error
    ? res.send(addResponse)
    : res.status(addResponse.status).send(addResponse);
});

CartRouter.get("/", async (req, res) => {
  res.send(await carts.readCarts());
});

CartRouter.get("/:id", async (req, res) => {
  res.send(await carts.getCartsById(req.params.id));
});

CartRouter.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const addResponse = await manager.addProductToCart(cid, pid);

  !addResponse.error
    ? res.send(addResponse)
    : res.status(addResponse.status).send(addResponse);
});

CartRouter.put("/:cid/products", async (req, res) => {
  const cid = req.params.cid;
  const products = req.body;
  const updateResponse = await manager.updateProducts(cid, products);

  !updateResponse.error
    ? res.send(updateResponse)
    : res.status(updateResponse.status).send(updateResponse);
});

CartRouter.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body;
  const updateResponse = await manager.updateQuantity(cid, pid, quantity);

  !updateResponse.error
    ? res.send(updateResponse)
    : res.status(updateResponse.status).send(updateResponse);
});

CartRouter.delete("/:cid/products/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const deleteResponse = await manager.removeToCart(cid, pid);

  !deleteResponse.error
    ? res.send(deleteResponse)
    : res.status(deleteResponse.status).send(deleteResponse);
});

CartRouter.delete("/:cid/products", async (req, res) => {
  const cid = req.params.cid;
  const deleteResponse = await manager.removeAllProductsToCart(cid);

  !deleteResponse.error
    ? res.send(deleteResponse)
    : res.status(deleteResponse.status).send(deleteResponse);
});

export default CartRouter;
