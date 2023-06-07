const {Router} = require('express');
const {check} = require('express-validator');
const {validarErroresCampos} = require('../middlewares/validar-campos');
const {loginController, googleSignIn} = require('../controllers/auth');

const router = Router();

router.post(
  '/login',
  [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarErroresCampos,
  ],
  loginController
);

router.post(
  '/google',
  [
    check('id_token', 'El id_token de google es necesario').not().isEmpty(),
    validarErroresCampos,
  ],
  googleSignIn
);

module.exports = router;
