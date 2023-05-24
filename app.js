require('dotenv').config(); //.config() es para que lea las variables declaras en el archivo .env
// const cors = require('cors');
const Server = require('./models/server');

const server = new Server();

server.listen();
