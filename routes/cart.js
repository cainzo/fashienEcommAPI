const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../verifyToken');
const Cart = require("../models/Cart");
const router = require('express').Router();

//crear nuevo producto
router.post('/', verifyTokenAndAuthorization , async(req,res)=>{
    const newCart = new Cart(req.body);
    try {
        const savedCart = await newCart.save()
        res.status(200).json(savedCart)
    } catch (error) {
        res.status(500).json(err)
    }
})

//Update Productoer
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {$set: req.body},{ new: true }); // buscamos el usuario por id, updateamos y retornamos
      res.status(200).json(updatedCart);
    } catch (err) {
      res.status(500).json(err);
    }
});

//delete Product
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
      await Cart.findByIdAndDelete(req.params.id);
      res.status(200).json("Cart eliminado correctamente");
    } catch (err) {
      res.status(500).json(err);
    }
});

//get user cart
router.get("/find/:userId",verifyTokenAndAuthorization, async (req, res) => {
    try {
      const cart = await Cart.findOne({userId: req.params.userId});

      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //get all products
router.get("/",verifyTokenAndAdmin, async (req, res) => {  
    try {
        const carts = await Cart.find()
        res.status(200).json(carts)
    } catch (error) {
        res.status(500).json(error)
    }
   
  });


module.exports = router