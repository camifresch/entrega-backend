import {promises as fs} from 'fs';
import {nanoid} from 'nanoid';
import Products from './ProductManager.js';
import cartsModel from '../models/carts.model.js';

const productAll = new Products

class CartManager {
    constructor() {
        this.path = "./src/models/carts.json"
    }

    readCarts = async () => {
        let carts = await fs.readFile(this.path, "utf-8")
        return JSON.parse(carts);
    }

    writeCarts = async (carts) => {
        await fs.writeFile(this.path, JSON.stringify(carts));
    }

    exist = async (id) => {
        let carts = await this.readCarts();
        return carts.find(cart => cart.id === id)
    }

    getCarts = async () => {
        try {
          const carts = await cartsModel.find().populate("products.pid");
          return !carts.length
            ? {
              status: 404,
              error: "No se encontraron carritos",
            }
            : carts;
        } catch (err) {
          return {
            status: 500,
            error: `Ocurrió un error al intentar obtener los carritos: ${err}`,
          };
        }
      }

    addCarts = async () => {
        try {
            return await cartsModel.create({ products: [] });
          } catch (err) {
            return {
              status: 500,
              error: `Ocurrió un error al intentar crear el carrito: ${err}`,
            };
          }
        }

    getCartsById = async (id) => {
        try {
            const cart = await cartsModel.findById(id).lean().populate("products.pid");
            return cart === null
              ? {
                status: 404,
                error: `No se encontró el carrito con ID [${id}]`,
              }
              : cart.products;
          } catch (err) {
            return {
              status: 500,
              error: `Ocurrió un error al intentar obtener el carrito con ID [${id}]: ${err}`,
            };
          }
        }

    addProductInCart = async (cartId, productId) =>{
        let cartById = await this.exist(cartId)
        if(!cartById) return "Carrito no encontrado"
        let productById = await productAll.exist(productId)
        if(!cartById) return "Producto no encontrado"
        
        let cartAll = await this.readCarts()
        let cartFilter = cartAll.filter(cart => cart.id != cartId)

        if(cartById.products.some(prod => prod.id === productId)) {
            let moreProductInCart = cartById.products.find((prod) => prod.id === productId)
            moreProductInCart.cantidad++;
            let cartsConcat = [cartById, ...cartFilter]
            await this.writeCarts(cartsConcat)
            return "Producto Sumado al Carrito"
        }

        cartById.products.push({id: productById.id, cantidad: 1})

        let cartsConcat = [cartById, ...cartFilter]
        await this.writeCarts(cartsConcat)
        return "Producto Agregado al Carrito"
    }
}

export default CartManager