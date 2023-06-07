const express = require('express');
const cors = require('cors');
const {dbConnection} = require('../db/config');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = '/api/users';
    this.authPath = '/api/auth';

    //Conectar a la DB (dentro del constructor para que se ejecute justo al momento de lanzar el server)
    this.conectarDB();
    //Middlewares
    this.middlewares();
    //Rutas de la aplicacion
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    //CORS
    this.app.use(cors());
    //Lectura y parseo del Body (.put, .post)
    this.app.use(express.json());
    //!Directorio publico: La app primero va a entrar a este middleware y no a la ruta "this.app.get('/',...)". Pero si le pongo '/api' o cualquier otra ruta que no sea '/' todo funciona normal.
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.authPath, require('../routes/auth'));
    this.app.use(this.usersPath, require('../routes/user'));
  }
  //* el método listen() se encuentra fuera del constructor para YO elegir cuando disparar la escucha del server. Si estaria adentro lo que sucederia es que cada vez que necesite instanciar un new Server() automaticamente se dispararia la escucha y tendria muchos listen() disparados y se romperia todo!
  listen() {
    this.app.listen(this.port, () => {
      console.log(`[SERVER ON PORT]: ${this.port}`);
    });
  }
}

module.exports = Server;
