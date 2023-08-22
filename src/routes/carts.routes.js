import { Router } from "express";

import { Carrito } from "../helpers/cartManager.js";
import { ProductManager } from "../helpers/productManager.js";

const cartRouter = Router();
const carrito = new Carrito();
const products = new ProductManager();

cartRouter.post('/' , async (req, res) =>{
    carrito.createCart()
    res.status(200).send("Carrito creado con exito")
})

cartRouter.get('/:id' , async (req, res)=>{
    const {id} = req.params
    const cart = await carrito.getCartById(id)
    
    if ( cart ){
        res.status(200).send(cart)
    } else{
        res.status(404).send("Carrito no encontrado")
    }
})

cartRouter.post('/:cartId/product/:productId' , async (req, res) =>{
    try{
        const cartId = req.params.cartId
        const productId = req.params.productId
        const quantity = req.body.quanty || 1;

        const prod = await products.getProductsById(productId)

        if(prod){
            await carrito.addCartProduct(cartId, productId, quantity)
            res.status(200).send("producto agregado con exito al carrito")
        }else{
            res.status(400).send("producto no encontrado")
        }
    } catch(error){
        console.log("error al agregar producto al carrito")
    }

})

export default cartRouter;