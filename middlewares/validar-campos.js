const {validationResult} = require('express-validator');

const validarErroresCampos = (req, res, next) => {
  const errorsValidators = validationResult(req);
  if (!errorsValidators.isEmpty()) {
    return res.status(400).json(errorsValidators);
  }
  //primero se hacen los checks() del user.routes. Pasa el check para name & next(), pasa el check para password & next() y cuando ya pasa el el ultimo check() se ejecuta el controlador de la ruta.
  next();
};

module.exports = {
  validarErroresCampos, //se ejecuta como 3er argumento en las routes (despues de los checks)
};
