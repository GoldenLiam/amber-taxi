import { Manager } from "socket.io-client";
import io from "socket.io-client";


const socketURL = process.env.SOCKETURL || 'http://localhost:5000/';

/*
const manager = new Manager("ws://example.com", {
  reconnectionDelayMax: 10000,
  query: {
    "my-key": "my-value"
  }
});

const socket = manager.socket("/my-namespace", {
  auth: {
    token: "123"
  }
});
*/

const manager = new Manager(socketURL, {
    reconnectionDelayMax: 10000,
    query: {
      "my-key": "my-value"
    },
    autoConnect: false
});

const driverSocket = manager.socket("/driver");

export default driverSocket;
/*

//Turn off auto connect
const driverSocket = io(socketURL + 'driver', {
    autoConnect: false
});

export default driverSocket;
*/