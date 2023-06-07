const {request, response} = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const generateJWT = require('../helpers/generate-jwt');
const {googleVerify} = require('../helpers/google-verify');

const loginController = async (req = request, res = response) => {
  const {email, password} = req.body;

  try {
    //*Verificar si el email existe
    const usuarioLogueandose = await User.findOne({email});
    if (!usuarioLogueandose) {
      return res.status(400).json({
        msg: 'Email/Password no son correctos - email',
      });
    }

    //*Verificar si el usuario esta activo (state = true)
    if (!usuarioLogueandose.state) {
      return res.status(400).json({
        msg: 'Email/Password no son correctos - state: false',
      });
    }

    //*Verificar el password
    const validPassword = bcryptjs.compareSync(
      password,
      usuarioLogueandose.password
    );
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Email/Password no son correctos - password',
      });
    }

    //*Generar el JWT: lo tengo que hacer con una new Promise en su archivo para aca usar el await de la promesa retornada de la function generateJWT.
    const token = await generateJWT(usuarioLogueandose.id);

    res.json({
      usuarioLogueandose,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: 'Algo salio mal, hable con el admin',
    });
  }
};

const googleSignIn = async (req = request, res = response) => {
  const {id_token} = req.body;

  try {
    const {name, email, img} = await googleVerify(id_token);

    let user = await User.findOne({email});
    if (!user) {
      //Tengo que crearlo en Mongo
      const data = {
        name,
        email,
        img,
        password: ':p', //vacio xq el password va hasheado con bcrypt
        google: true,
        role: 'USER_ROLE',
      };

      user = new User(data);
      await user.save();
    }

    //*Checkear que el user en Mongo tenga state = true. Xq puede ser un usuario de google pero no estar en mi DB
    if (!user.state) {
      return res.status(401).json({
        msg: 'Usuario bloqueado, hable con el admin',
      });
    }

    //*Generar el JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'El token no se pudo verificar',
    });
  }
};

module.exports = {
  loginController,
  googleSignIn,
};
