const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
  name: {
    type: String,
    required: [true, 'The name is required'], //error por si no se ingresa el name
  },
  email: {
    type: String,
    required: [true, 'The email is required'], //error por si no se ingresa el email
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'The password is required'], //error por si no se ingresa el password
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'],
  },
  state: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

//!Lo siguiente es para modificar el json que se manda como res al frontend. Sacando __v y el password. En finalUser ya no va a estar password ni __v
UsuarioSchema.methods.toJSON = function () {
  const {__v, password, ...finalUser} = this.toObject();
  return finalUser;
};

module.exports = model('User', UsuarioSchema); //mongo le agrega la 's' al nombre de la coleccion, por eso se pone en singular aca.
