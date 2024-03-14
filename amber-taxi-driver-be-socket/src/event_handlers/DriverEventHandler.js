class DriverEventHandler {
    
    constructor(io, socket, app){
        this.io  = io;
        this.app = app;
        this.socket = socket;
    }

    goOnline(){
        this.socket.broadcast.emit('driver-come-online', '');
    }

    sendLocation(){
        this.socket.send("give me location!");
    }

    sendHelloMessage(){
        this.socket.send("hello i'm in underwater - some india guy");
    }

}

export default DriverEventHandler;