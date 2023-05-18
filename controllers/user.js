const {response, request} = require('express'); //se hace esto para tener autocompletado al escribir 'res.', con TS esto no haria falta.

const userGet = (req = request, res = response) => {
  const {q, name} = req.query;

  res.json({
    msg: 'get API - controller',
    q,
    name,
  });
};
const userPut = (req = request, res = response) => {
  const {id} = req.params;

  res.json({
    msg: 'put API - controller',
    id,
  });
};
const userPost = (req = request, res = response) => {
  //aca leo el body!
  const {name, edad} = req.body;
  res.json({
    msg: 'post API - controller',
    name,
    edad,
  });
};
const userDelete = (req = request, res = response) => {
  res.json({
    msg: 'delete API - controller',
  });
};
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
