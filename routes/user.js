const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const {verifyTokenAndAuthorization, verifyTokenAndAdmin}= require("../verifyToken");

//Update User
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
      //comprobar si estamos cambiando password
      req.body.password = CryptoJS.AES.encrypt(req.body.password,process.env.PASS_SEC).toString(); //encriptamos la nueva pass 
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body},{ new: true }); // buscamos el usuario por id, updateamos y retornamos
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }

});

//delete User
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User eliminado correctamente");
    } catch (err) {
      res.status(500).json(err);
    }
});

//get 1 user
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const userInfo = await User.findById(req.params.id);
    const { password, ...info } = userInfo._doc; //devolvemos toda la info sin la password
    res.status(200).json(info);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get los ultimos 10 usuarios
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(3)
        : await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
});

//get user stats
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;
