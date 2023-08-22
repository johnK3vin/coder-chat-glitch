import { ProductManager } from "../helpers/productManager.js";
import { Router } from "express";


const prodsRouter = Router();
const product = new ProductManager();


prodsRouter.get('/', async(req, res)=>{
    const { limit } = req.query;
    const list = await product.getProducts();

    if(!isNaN(limit) && limit != 0 && limit <= list.length){
        const limit_list = list.slice(0, limit);
        res.send(limit_list);
    }else{
        const allProduct = await product.getProducts();
        res.send(allProduct);
    }
})

prodsRouter.get('/:id' , async(req, res) =>{
    const id = parseInt(req.params.id);
    const list = await product.getProductsById(id);

    if(list){
        res.send(list);
    }else{
        res.status(404).send("El Producto no existe");
    }
})

prodsRouter.post('/', async(req, res) =>{
    console.log(req.body);
    const products = await product.getProducts();
    const prod = products.find(items => items.code == req.body.code);

    if(prod){
        res.status(400).send("Producto ya existente");
    }else{
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;
        product.addProduct(title, description, price, thumbnail, code, stock, status, category);
        res.status(200).send("Producto agregado con exito");
    }
})

prodsRouter.put('/:id', async(req, res) =>{
    const { id } = req.params;

    const products = await product.getProducts();
    const index = products.findIndex(items => items.id ===  parseInt(id))

    if(index !== -1){
        product.updateProduct(id, req.body)
        res.status(200).send("Producto modificado con exito")
    }else{
        res.status(404).send("Producto no existente")
    }
})

prodsRouter.delete('/:id', async(req, res) =>{
    const { id } = req.params;
    const products = await product.getProducts();
    const prod = products.some(items => items.id === parseInt(id))

    if(prod){
        product.delateProduct(id);
        res.status(200).send("Producto eliminado con exito");
    }else{
        res.status(404).send("Producto no existe");
    }

})


export default prodsRouter;