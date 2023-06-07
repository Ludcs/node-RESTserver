const {Router} = require('express');
const {check} = require('express-validator');

const {validarJWT} = require('../middlewares/validar-jwt');
const {isAdminRole, tieneRole} = require('../middlewares/validar-rol');
const {validarErroresCampos} = require('../middlewares/validar-campos');
const {
  userGet,
  userPut,
  userPost,
  userDelete,
  userPatch,
} = require('../controllers/user');
const {
  esRoleValido,
  esEmailValido,
  existeUsuarioPorId,
} = require('../helpers/db-validators');
const router = Router();

//todas estas rutas en su url tienen adelante '/api/users'. No ejecuto el controller, solo lo paso por referencia.
router.get('/', userGet);

router.post(
  '/',
  [
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('password', 'El password debe tener al menos 6 caracteres').isLength({
      min: 6,
    }),
    //check('email', 'No tiene el formato de correo').isEmail(),
    check('email').custom(esEmailValido),
    //check('role', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(esRoleValido),
    validarErroresCampos,
  ],
  userPost
);

router.put(
  '/:id',
  [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('role').custom(esRoleValido),
    validarErroresCampos,
  ],
  userPut
);

router.delete(
  '/:id',
  [
    validarJWT,
    //isAdminRole, //!esta ruta fuerza a que solo puedan deletear los admin
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarErroresCampos,
  ],
  userDelete
);

router.patch('/', userPatch);

module.exports = router;

//!A esta parte de la fn router se le dice CONTROLADOR:
//...(req, res) => {
//   res.json({
//     msg: 'get API',
//   });
// }
