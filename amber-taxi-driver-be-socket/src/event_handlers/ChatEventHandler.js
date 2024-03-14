class ChatEventHandler {
    
    constructor(io, socket, app){
        this.io  = io;
        this.app = app;
        this.socket = socket;
    }

    sendMessage(){
        this.socket.emit('message', 'PONG!');
    }

}

export default ChatEventHandler;