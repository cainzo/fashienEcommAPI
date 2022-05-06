const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; //tomamos el token, lo dividimos y tomamos el segundo item que el token sin la palabra "bearer"
    jwt.verify(token, process.env.PASS_SEC , (err, user) => {
      if (err) res.status(403).json("Token invalido");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("no autenticado");
  }
}
const verifyTokenAndAuthorization = (req, res, next) => {
  verify(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {//comprobamos las credenciales del User logeado, si es el mismo usario o es el admin intentando cambiar los datos del User
      next();
    } else {
      res.status(403).json("Estas autorizado");
    }
  });
};
const verifyTokenAndAdmin = (req,res,next)=>{
  verify(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
}

module.exports = {
  verify,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};