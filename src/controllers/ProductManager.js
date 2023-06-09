import {promises as fs} from 'fs';
import {nanoid} from 'nanoid';
import productModel from '../models/products.model.js';

class Products {
    constructor() {
        this.products = [];
        this.status = 0;
        this.statusMsg = "inicializado";
    }

    static requiredFields = ['title', 'description', 'price', 'stock'];

    static #verifyRequiredFields = (obj) => {
        return Products.requiredFields.every(field => Object.prototype.hasOwnProperty.call(obj, field) && obj[field] !== null);
    }

    static #objEmpty (obj) {
        return Object.keys(obj).length === 0;
    }

    checkStatus = () => {
        return this.status;
    }

    showStatusMsg = () => {
        return this.statusMsg;
    }

    addProduct = async (product) => {
        try {
            if (!Products.#objEmpty(product) && Products.#verifyRequiredFields(product)) {
                const process = await productModel.create(product);
                this.status = 1;
                this.statusMsg = "Producto registrado en bbdd";
            } else {
                this.status = -1;
                this.statusMsg = `Faltan campos obligatorios (${Products.requiredFields.join(', ')})`;
            }
        } catch (err) {
            this.status = -1;
            this.statusMsg = `AddProduct: ${err}`;
        }
    }

    getProducts = async (query, limit = 10, page = 1, sort) => {
        try {
            if (query) { query = JSON.parse(query) };

            const products = await productModel.paginate(query, {
                limit: limit,
                page: page,
                sort: { price: sort },
                lean: true,
            });
            
            if (products.hasPrevPage) {
                products.prevLink = `http://localhost:3000/api/products/?${query ? 'query=' + query + "&" : ""
                    }${'limit=' + limit}${'&page=' + (+page - 1)}${sort ? '&sort=' + sort : ''}`;
            } else {
                products.prevLink = null;
            };

            if (products.hasNextPage) {
                products.nextLink = `http://localhost:3000/api/products/?${query ? 'query=' + query + "&" : ""
                    }${'limit=' + limit}${'&page=' + (+page + 1)}${sort ? '&sort=' + sort : ''}`;
            }
            else {
                products.nextLink = null
            };

            return {
                status: 'success',
                payload: products.docs,
                totalPages: products.totalDocs,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.prevLink,
                nextLink: products.nextLink,
            };
        } catch (err) {
            return {
                status: 'error',
                message: `Ocurrio un error al intentar obtener los productos: ${err}`,
            }
        }
    }

    getProductsPaginated = async (offset, itemsPerPage) => {
        try {
            const queryOptions = {
                offset: offset,
                limit: itemsPerPage,
                lean: true 
            }
            const products = await productModel.paginate({}, queryOptions);
            
            this.status = 1;
            this.statusMsg = 'Productos recuperados';
            return products;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `getProducts: ${err}`;
        }
    }

    getProductById = async (id) => {
        try {
            this.status = 1;
            const product = productModel.findById(id);
            return product;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `getProductById: ${err}`;
        }
    }

    updateProduct = async (id, data) => {
        try {
            if (data === undefined || Object.keys(data).length === 0) {
                this.status = -1;
                this.statusMsg = "Se requiere body con data";
            } else {
                // Con mongoose.Types.ObjectId realizamos el casting para que el motor reciba el id en el formato correcto
                const process = await productModel.updateOne({ '_id': new mongoose.Types.ObjectId(id) }, data);
                this.status = 1;
                process.modifiedCount === 0 ? this.statusMsg = "El ID no existe o no hay cambios por realizar": this.statusMsg = "Producto actualizado";
            }
        } catch (err) {
            this.status = -1;
            this.statusMsg = `updateProduct: ${err}`;
        }
    }

    deleteProduct = async (id) => {
        try {
            const process = await productModel.deleteOne({ '_id': new mongoose.Types.ObjectId(id) });
            this.status = 1;
            process.deletedCount === 0 ? this.statusMsg = "El ID no existe": this.statusMsg = "Producto borrado";
        } catch (err) {
            this.status = -1;
            this.statusMsg = `deleteProduct: ${err}`;
        }
    }
}

export default Products;


