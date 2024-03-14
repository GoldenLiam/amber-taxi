import ChatEventHandler from "../src/event_handlers/ChatEventHandler";
import DriverEventHandler from "../src/event_handlers/DriverEventHandler";


//https://blog.logrocket.com/building-real-time-location-app-node-js-socket-io/

var app = {
    allDriverOnlineSockets: [],
    allDriverReadyForRideSockets: []
};


const configureIOs = (io) => {

    const ioDriver = io.of("driver");    
    ioDriver.on('connection', onDriverNamspaceDriver(ioDriver));

    //io customer

    //other...

}

//need to carefully
const configureSockets = (io, socket) => {
    return {
        driverEventHandler: new DriverEventHandler(io, socket, app),
    };
};


//socket.send('hello') ~= socket.emit('message', 'hello')



const onDriverNamspaceDriver = (ioDriver) => (socket) => {
    var { driverEventHandler } = configureSockets(ioDriver, socket);

    //socket.broadcast.to('driver')

    //Driver connect to socket will be known as online
    socket.on("driver-online", () => {
        //check tài khoản tài xế này và đặt nick name là email
        //socket.nickname = ""
        socket.join("drivers-online-room");
    })

    //always check state
    socket.to("drivers-online-room").emit("driver-give-state", (err, responses) => {
        console.log(responses);
    });


    socket.on("driver-give-state", (message) => {
        console.log(message);

        var driverState = message;

        //if()
        
    })

    socket.on("driver-update", (message) => {
        console.log(message)
    });

    socket.on('xin chao tu tai xe', () => {
        console.log("xin chao");

        driverEventHandler.sendLocation();
    })

    socket.on('message', (message) => {
        console.log(message)
        socket.send('WANG TAU CAI PONG!');
    })

    // Bắt sự kiện ngắt kết nối để offline tài xế

}


const onConnection = (io) => (socket) => {
    // console.log("I'm zombie");
    // console.log(socket.id);

    const ioDriver = io.of("driver");

    var { driverEventHandler } = configureSockets(io, socket);

    /*
    socket.use( ([event, ...args], next) => {
        console.log(event);
    })
    */

    socket.on('driver-go-online', () => {
        console.log("this guy go online");
    })

    socket.on('driver-join-to-driver-shift', () => {
        
    })

    socket.on('xin chao tu tai xe', () => {
        console.log("xin chao");

        driverEventHandler.sendLocation();
    })

    socket.on('message', () => {
        socket.send('WANG TAU CAI PONG!');
    })



    // a bit earlier then disconnect
    socket.on("disconnecting", (reason) => {
        // for (const room of socket.rooms) {
        //     if (room !== socket.id) {
        //     socket.to(room).emit("user has left", socket.id);
        //     }
        // }
        console.log("bye");
    });

    /*
    socket.on("disconnect", (reason) => {
        console.log(reason);
    });
    */


    /*
    socket.on('chat', () => {
        //socket.send("hello");
        console.log("go here")
        socket.emit('none', 'PONG!');
    });

    socket.on('message', () => {
        socket.send('WANG TAU CAI PONG!');
    })

    socket.on('connection', () => {

        //socket.emit("driver-hello", "hello i'm in underwater - some india guy");

        

    })
    */



    // Keep track of the socket
    app.allSockets.push(socket);
};

export default configureIOs;