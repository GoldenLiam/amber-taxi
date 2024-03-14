const express = require('express');
const dotenv = require('dotenv')
const routes = require('./routes')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const http = require('http')
const socketio = require('socket.io');
const { configureIO } = require('./socket');

dotenv.config();

const app = express();
const server = http.createServer(app)
const port = process.env.PORT || 3001


/**** APP WEB ****/
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

routes(app)


/**** SOCKET ****/
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

configureIO(io);

server.listen(port, () => {
    console.log('Server is running in port: ' + port)
})