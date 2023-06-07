const jwt = require('jsonwebtoken');

const generateJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    //poner lo que voy a grabar en el payload (en este caso solo el uid xq puede ser peligroso poner otros datos sensibles)
    const payload = {uid};

    //instruccion para firmar/crear el jwt
    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: '4h',
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject('No se pudo generar el token');
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = generateJWT;
