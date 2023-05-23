const Role = require('../models/role');
const User = require('../models/user');

const esRoleValido = async (role = '') => {
  const existRole = await Role.findOne({role});
  if (!existRole) {
    throw new Error(`El rol ${role} no esta registrado en la db`);
  }
};
const esEmailValido = async (email = '') => {
  const emailExist = await User.findOne({email});
  if (emailExist) {
    throw new Error(`El email ${email} ya se encuentra registrado`);
  }
};
const existeUsuarioPorId = async (id) => {
  const userIdExist = await User.findById(id);
  if (!userIdExist) {
    throw new Error(`El usuario con el id ${id} no existe`);
  }
};

module.exports = {
  esRoleValido,
  esEmailValido,
  existeUsuarioPorId,
};
