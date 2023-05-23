const mongoose = require('mongoose');

const dbConnection = async () => {
  //como es una conexion a un servicio externo siempre es mejor hacerlo en un try catch
  try {
    await mongoose.connect(process.env.MONGODB_CHAIN_CONECTION);
    console.log('DB Online');
  } catch (err) {
    console.log(err);
    throw new Error('Error al iniciar la db');
  }
};

module.exports = {
  dbConnection,
};
