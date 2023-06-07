const {request, response} = require('express');

const isAdminRole = (req = response, res = request, next) => {
  if (!req.userAuthenticated) {
    res.status(500).json({
      msg: 'No se puede validar el role sin validar el token primero',
    });
  }
  const {role, name} = req.userAuthenticated;

  if (role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: `${name} no tiene rol de Administrador - No puede hacer la tarea solicitada`,
    });
  }

  next();
};

const tieneRole = (...roles) => {
  return (req = request, res = response, next) => {
    //console.log(roles, req.userAuthenticated.role);
    if (!req.userAuthenticated) {
      res.status(500).json({
        msg: 'No se puede validar el role sin validar el token primero',
      });
    }
    //verificar si no tiene el rol necesario para ejecutar la accion (delete en este caso)
    if (!roles.includes(req.userAuthenticated.role)) {
      return res.status(401).json({
        msg: `El servicio requiere uno de estos roles ${roles} `,
      });
    }
    next();
  };
};

module.exports = {
  isAdminRole,
  tieneRole,
};
