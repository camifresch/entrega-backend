import { Router } from "express";
import { __dirname } from '../utils.js';
import Products from "../controllers/ProductManager.js";
import CartManager from "../controllers/CartManager.js";

const ViewRouter = Router()
const productManager = new Products((`${__dirname}/../src/models/products.json`))
const cartManager = new CartManager();

ViewRouter.get("/products?", async (req, res) => {
  const { query, limit, page, sort } = req.query;
  let {
    payload,
    hasNextPage,
    hasPrevPage,
    nextLink,
    prevLink,
    page: resPage,
  } = await productManager.getProducts(query, limit, page, sort);
  if (hasNextPage)
    nextLink = `products/?${
      query ? "query=" + query + "&" : ""
    }${"limit=" + limit}${"&page=" + (+resPage + 1)}${
      sort ? "&sort=" + sort : ""
    }`;
  if (hasPrevPage)
    prevLink = `products/?${
      query ? "query=" + query + "&" : ""
    }${"limit=" + limit}${"&page=" + (+resPage - 1)}${
      sort ? "&sort=" + sort : ""}`;
  res.render("products", {
    payload,
    hasNextPage,
    hasPrevPage,
    nextLink,
    prevLink,
    resPage,
  });
});


ViewRouter.get("/carts/:cid", async (req, res) => {
  const id = req.params.cid;
  const cart = await cartManager.getCartById(id);
  cart.error ? res.render("404", {}) : res.render("cart", { cart });
});


export default ViewRouter;