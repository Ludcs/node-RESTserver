const {response, request} = require('express'); //se hace esto para tener autocompletado al escribir 'res.', con TS esto no haria falta.
const bcryptjs = require('bcryptjs');
const User = require('../models/user'); //la U va en mayusc, es un estandar para poder crear luego instancias del mismo.

//*GET CONTROLLER
const userGet = async (req = request, res = response) => {
  const {limit = 5, from = 0} = req.query;
  //!users y totalUsers son dos promesas que generan codigo bloqueante. Por eso es mejor hacerlo con Promise.all() para que sean devueltas juntas al mismo tiempo
  // const users = await User.find({state: true})
  //   .skip(Number(from))
  //   .limit(Number(limit));
  // const totalUsers = await User.countDocuments({ state: true });
  //!si mando resp asi como esta, el json se ve desprolijo. Si desestructoro el array, le pongo a la primera posicion 'totalUsers' y la segunda 'users' y se lee mejor
  // const resp = await Promise.all([
  //   User.countDocuments({state: true}),
  //   User.find({state: true}).skip(Number(from)).limit(Number(limit)),
  // ]);

  // res.json({
  //   resp
  // });

  const [totalUsers, users] = await Promise.all([
    User.countDocuments({state: true}),
    User.find({state: true}).skip(Number(from)).limit(Number(limit)),
  ]);

  res.json({
    totalUsers,
    users,
  });
};

//*POST CONTROLLER
const userPost = async (req = request, res = response) => {
  //*!aca leo el body y con destructuring me aseguro guardar las key que yo quiera y no todas las que me mande el front
  const {name, email, password, role} = req.body;
  //instancia de nuestro model de user.js. Paso el body entero y si me mandan otro key que no este en el model user, mongoose no lo agrega (lo discrimina)
  const user = new User({
    name,
    email,
    password,
    role,
  });
  //2)Encriptar password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  //Guardar en db
  await user.save();

  res.json({
    user,
  });
};

//*PUT CONTROLLER
const userPut = async (req = request, res = response) => {
  const {id} = req.params;
  const {_id, password, google, email, ...rest} = req.body; //!_id, password, google e email no lo quiero, pero '...rest' SI y es lo que voy a actualizar

  //TODO: validar contra la base de datos
  if (password) {
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt); //!rest.password agrega dentro de rest una nueva key password
  }

  const userFoundedById = await User.findByIdAndUpdate(id, rest, {new: true});

  res.json({
    userFoundedById,
  });
};

//*DELETE CONTROLLER
const userDelete = async (req = request, res = response) => {
  const {id} = req.params;

  //const uid = req.uid; //! ESTE 'UID' ES EL QUE ME LLEGA POR REFERENCIA DESDE EL ARCHIVO validad-jwt.js
  //!Borrar fisicamente (NO RECOMENDADO xq perdemos la data desde MongoDB)
  //const userDeleted = await User.findByIdAndDelete(id);
  const userDeleted = await User.findByIdAndUpdate(id, {state: false});
  const userAuthenticated = req.userAuthenticated; //! ESTE 'USERAUTHENTICATED' ES EL QUE ME LLEGA POR REFERENCIA DESDE EL ARCHIVO validad-jwt.js
  console.log(userAuthenticated);

  res.json({
    userDeleted,
    userAuthenticated,
  });
};

//*PATCH CONTROLLER
const userPatch = (req = request, res = response) => {
  res.json({
    msg: 'patch API - controller',
  });
};

module.exports = {
  userGet,
  userPut,
  userPost,
  userDelete,
  userPatch,
};
