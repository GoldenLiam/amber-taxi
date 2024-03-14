require('dotenv').config();

import ioAuth from '../src/middlewares/IOAuth';
import configureIOs from './socket';

const server = require('http').createServer();
const { Server } = require("socket.io");

//const onConnection = require("./socket").default;


const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

configureIOs(io);

//io.use(ioAuth);



/*
io.on('connection', onConnection(io));

start
*/

export default server;