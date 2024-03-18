import React, { createContext, useState, useRef, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { io } from 'socket.io-client';
import { beAPI } from '../api';

// Khởi tạo context
const SocketChatingContext = createContext();

// Khởi tạo socket
const socket = io('http://localhost:5005', {autoConnect: false});


const SocketChatingContextProvider = ({ children }) => {
    
    // Biến uuid của ride lấy từ params
    const { uuid } = useParams();

    const [messageList, setMessageList] = useState([]);

    //Note biến mới
    var myself = {
        uuid: 'JQKKA2',
        uuid_ride: "JQKA2",
        display_name: "Customer"
    };


    const loadMessageList = async () => {
        // Lấy dữ liệu ride bằng uuid
        let responseMessageData = await beAPI.get(`/message/getAllByRideId/${uuid}`);

        if (responseMessageData.status == 200){
            if( JSON.stringify(messageList) != JSON.stringify(responseMessageData.data.data) ){
                setMessageList(responseMessageData.data.data);
            }
        }
    }


    useEffect(() => {

        loadMessageList();

        //Mở kết nối socket
        socket.connect();
        
        //Định danh trước khi chat
        socket.emit('registerBeforeChating', {
            uuid: localStorage.getItem("uuid"), 
            uuid_ride: myself.uuid_ride,
            role: localStorage.getItem("role"),
            phone: localStorage.getItem("phone"),
            display_name: localStorage.getItem("fullName")
        });
 

        console.log("opop");

        return () => {
            socket.disconnect();
        };

    }, []);


    const sendMessageSocket = ( userToChat, message ) => {

        let newMessageList = [...messageList];
        newMessageList.push({
            rideId: uuid,
            senderId:  localStorage.getItem("uuid"),
            receiverId: userToChat,
            message: message
        });

        setMessageList(newMessageList);

        socket.emit('sendMessageInRide', {
            user_to_chat: userToChat, message, from_user: localStorage.getItem("uuid"), uuid_ride: uuid
        });
    }


    socket.on('receiveMessageInRide', ({ message, fromUser }) => {
        //console.log(message)
        let newMessageList = [...messageList];
        newMessageList.push(message);

        if( JSON.stringify(newMessageList) != JSON.stringify(messageList) ){
            setMessageList(newMessageList);
        }

    });


    return(
        <SocketChatingContext.Provider value={{
            myself,
            sendMessageSocket,
            messageList,
            setMessageList
        }}>
            {children}
        </SocketChatingContext.Provider>
    )
}

export { SocketChatingContextProvider, SocketChatingContext };