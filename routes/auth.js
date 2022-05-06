const router = require('express').Router();
const User = require('../models/User')
const CryptoJS = require('crypto-js')
const jwt = require("jsonwebtoken");


//registro
router.post("/register", async (req,res)=>{
     const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password , process.env.PASS_SEC).toString(),
    });
    try{
        const user = await newUser.save();
        res.status(201).json(user);
    }catch(err){
       res.status(503).json(err)
    
    }
});

//login 
router.post("/login", async (req,res)=>{
    try{
        const user = await User.findOne({username: req.body.username});//buscamos un usuario por el email provisto en el body de la req
        !user && res.status(401).json("El usuario ingresado no existe");// si no hay unm usuario que coinsida con nuestra busqueda mostramos el error 
       
        const hashPass = await CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const pass = hashPass.toString(CryptoJS.enc.Utf8);
        pass !== req.body.password && res.status(456).json("La password ingresada es incorrecta");

        const accessToken = jwt.sign({id: user._id, isAdmin: user.isAdmin},process.env.PASS_SEC, {expiresIn:'1d'} ); // token para distigir entre usuarios y admins, tambien expira en un dia  y hay que volver a logear
        const {password, ...info} = user._doc; //devolvemos toda la info sin la password
            res.status(200).json({...info, accessToken});
    }catch(error){
     res.status(502).json(error)
    }
})


module.exports = router