import { calculateDistance } from '../src/utils';

require('dotenv').config();

const { createServer } = require("http");
//const { Server } = require("socket.io");
const express = require("express");
const app = express();
const httpServer = createServer(app);
var cors = require('cors')
//const { onConnection } = require("./socket");

app.use(cors())

// Set up for API app
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Routers
const APIRouter = require('../src/routers/BaseRouter');

app.use('/api', APIRouter);


// Test
app.get("/", async (req, res) => {

  res.json({ 
    message: "ok", 
    "distance": calculateDistance.calculateDistanceOneToOne( [53.32055555555556, -1.7297222222222221], [53.31861111111111, -1.6997222222222223] ) 
  });

});
//

//npx prisma db pull
//npx prisma generate

// Set up for socket.io
// const io = new Server(httpServer, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   },
// });

// io.on("connection", onConnection(io));

export default httpServer;

/* https://dev.to/pacheco/designing-a-better-architecture-for-a-node-js-api-24d */

// require('dotenv').config();

// const express = require("express");

// const app = express();


// const db = require('./db');

// var amqp = require('amqplib/callback_api');



// app.use(express.json());

// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

// amqp.connect('amqp://localhost', function(error0, connection) {
//     if (error0) {
//         throw error0;
//     }
//     connection.createChannel(function(error1, channel) {
//         if (error1) {
//             throw error1;
//         }

//         var queue = 'hello';
//         var msg = 'Hello World!';

//         channel.assertQueue(queue, {
//             durable: false
//         });
//         channel.sendToQueue(queue, Buffer.from(msg));

//         console.log(" [x] Sent %s", msg);
//     });
//     setTimeout(function() {
//         connection.close();
//         process.exit(0);
//     }, 500);
// });


// async function getAllCustomer(){
//   const sql = "SELECT * FROM Account";

//   return await new Promise((resolve, reject) => {
//       db.query(sql, function (err, result, fields) {
//           if(err){
//               reject(err);
//           }
//           else if(result.length > 0){
//               resolve(result);
//           }
//           else{
//               resolve(null);
//           }
//       })
//   });
// }

// app.get("/", async (req, res) => {

//   //var data = await getAllCustomer();
//   //console.log(data);

//   res.json({ message: "ok" });
// });

// //https://stackoverflow.com/questions/71698813/localhost-didn-t-send-any-data-on-docker-and-nodejs-app
// //fix docker
// const port = process.env.PORT || 8080;
// app.listen(port, '0.0.0.0', () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });