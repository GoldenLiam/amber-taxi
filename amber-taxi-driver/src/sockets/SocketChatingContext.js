import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

// Khởi tạo context
const SocketChatingContext = createContext();

// Khởi tạo socket
const socket = io('http://localhost:5005', {autoConnect: false});


const SocketChatingContextProvider = ({ children }) => {

    const [messageList, setMessageList] = useState([]);

    //Note biến mới
    var myself = {
        uuid: 'JQKKA2',
        uuid_ride: "JQKA2",
        display_name: "Driver"
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

            setMessageList([...messageList, {
                message,
                sentTime: "15 mins ago",
                direction: 'incoming',
                position: "single"
            }]);

        });

        return () => {
            socket.disconnect();
        };

    }, [messageList]);


    const sendMessage = ( userToChat, message ) => {
        socket.emit('sendMessage', { userToChat, message, fromUser: myself.uuid, uuidRide: myself.uuid_ride });
    }


    return(
        <SocketChatingContext.Provider value={{
            myself,
            sendMessage,
            messageList,
            setMessageList
        }}>
            {children}
        </SocketChatingContext.Provider>
    )
}

export { SocketChatingContextProvider, SocketChatingContext };