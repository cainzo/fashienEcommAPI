const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../verifyToken');
const Product = require("../models/Product");

const router = require('express').Router();


//crear nuevo producto
router.post('/', verifyTokenAndAdmin , async(req,res)=>{
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save()
        res.status(200).json(savedProduct)
    } catch (error) {
        res.status(500).json(err)
    }
})

//Update Productoer
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {$set: req.body},{ new: true }); // buscamos el usuario por id, updateamos y retornamos
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json(err);
    }
});

//delete Product
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).json("Product eliminado correctamente");
    } catch (err) {
      res.status(500).json(err);
    }
});

//get all producto
router.get("/find/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      res.status(200).json(product);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //get all products
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCat = req.query.cat;
      try {
        let products;
        if(qNew){
            products = await Product.find().sort({ _id: -1 }).limit(3)
        }else if ( qCat){
            products = await Product.find({
                cat:{
                    $in: [qCat],
                }
            })
        }else{
            products = await Product.find()
        }

       
        res.status(200).json(products);
      } catch (err) {
        res.status(500).json(err);
      }
  });

module.exports = router