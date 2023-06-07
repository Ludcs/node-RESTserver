const {request, response} = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header('x-token');
  if (!token) {
    res.status(401).json({
      msg: 'No se envio el token en la peticion',
    });
  }
  //*validacion del JWT (es algo tramposa):
  try {
    //! 1- Extraer el uid del usuario q viene en el payload del token y ademas verificar si el token es valido
    const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    console.log(uid);
    //console.log(payload.uid);
    //! 2- Validar si el usuario esta autenticado (desde Mongo usando el model desde user.js)
    const userAuthenticated = await User.findById(uid);
    //! 3- Validar el caso para usuario no existente (xq si no existe, la linea de arriba va a dar undefined en caso de no encontrarlo por el uid)
    if (!userAuthenticated) {
      return res.status(401).json({
        msg: ' Token no valido - El usuario no existe en la db ',
      });
    }
    //! 4- Validar si el state del usuario es true o false
    if (!userAuthenticated.state) {
      return res.status(401).json({
        msg: 'Token no valido, estado = false',
      });
    }

    //! 5- Creo una propiedad nueva del objeto request (userAuthenticated) con el valor de = userAuthenticated que me viene desde Mongo
    req.userAuthenticated = userAuthenticated; //!AHORA TODAS LAS REQ TIENEN LA PROPIEDAD UID QUE SE PASAN POR REFERENCIA DENTRO DEL ROUTER.DELETE HASTA LLEGAR AL userDelete CONTROLLER DEL ARCHIVO USER.JS DENTRO DE ROUTES!!!
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: 'Token no valido',
    });
  }
};

module.exports = {
  validarJWT,
};
