import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

// Khởi tạo context
const SocketChatingContext = createContext();

// Khởi tạo socket
const socket = io('http://localhost:9000', {autoConnect: false});


const SocketChatingContextProvider = ({ children }) => {

    //Note biến mới
    var myself = {
        uuid: 'JQKAA2',
        uuid_ride: "JQKA2",
        display_name: "Person A"
    };


    useEffect(() => {
        //Mở kết nối socket
        socket.connect();
        
        //Định danh trước khi chat
        socket.emit('registerBeforeChating', {
            uuid: myself.uuid, 
            uuid_ride: myself.uuid_ride,
            display_name: myself.display_name
        });
 

        socket.on('receiveMessage', ({ message, fromUser }) => {
            console.log(message);
        });

        return () => {
            socket.disconnect();
        };

    }, []);


    const sendMessage = ( userToChat, message ) => {
        socket.emit('sendMessage', { userToChat, message, fromUser: myself.uuid, uuidRide: myself.uuid_ride });
    }


    return(
        <SocketChatingContext.Provider value={{
            sendMessage,
            myself
        }}>
            {children}
        </SocketChatingContext.Provider>
    )
}

export { SocketChatingContextProvider, SocketChatingContext };