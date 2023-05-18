const {Router} = require('express');
const {
  userGet,
  userPut,
  userPost,
  userDelete,
  userPatch,
} = require('../controllers/user');
const router = Router();

//todas estas rutas en su url tienen adelante '/api/users'. No ejecuto el controller, solo lo paso por referencia.
router.get('/', userGet);

router.put('/:id', userPut);

router.post('/', userPost);

router.delete('/', userDelete);

router.patch('/', userPatch);

module.exports = router;

//!A esta parte de la fn router se le dice CONTROLADOR:
//...(req, res) => {
//   res.json({
//     msg: 'get API',
//   });
// }
