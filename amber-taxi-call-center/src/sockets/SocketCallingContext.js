import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

// Khởi tạo context
const SocketCallingContext = createContext();

// Khởi tạo socket
const socket = io('http://localhost:5000', {
    autoConnect: false
});


const SocketCallingContextProvider = ( childrenComponent ) => {
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState();
    const [name, setName] = useState('');
    const [call, setCall] = useState({});
    const [me, setMe] = useState('');
    const [callFail, setCallFail] = useState('');
    const [callFailReason, setCallFailReason] = useState('');


    //Note biến mới để định danh
    var myself = {
        uuid: "123456789",
        display_name: "Tổng đài viên"
    };

    //Biến thẻ media (cụ thể là video) người dùng
    const myVideo = useRef();

    //Biến thẻ media (cụ thể là video) người khác
    const userVideo = useRef();

    const connectionRef = useRef();

    useEffect(() => {
        //nếu chỉ cần gọi audio thì để video false và audio true
        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
            .then((currentStream) => {
                setStream(currentStream);

                //Đôi lúc thẻ video sẽ bị undefine do chưa load xong
                if(myVideo.current != undefined){
                    myVideo.current.srcObject = currentStream;
                }
        
                //myVideo.current.srcObject = currentStream;
            });
        
        //Mở kết nối socket
        socket.connect();

        
        //Định danh trước khi gọi
        socket.emit('registerBeforeCalling', {
            uuid: myself.uuid, 
            display_name: myself.display_name
        });

        
        //Không sử dụng
        socket.on('me', (id) => setMe(id));


        //Ai đó gọi đến
        socket.on('callUser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivingCall: true, from, name: callerName, signal });
        });


        //Gọi không thành công
        socket.on('callFail', (reasonMessage) => {
            setCallFail(true);
            setCallFailReason(reasonMessage);
        });


        return () => {
            socket.disconnect();
        };
        
    }, []);


    //Hàm trả lời cuộc gọi
    const answerCall = () => {
        setCallAccepted(true);
    
        const peer = new Peer({ initiator: false, trickle: false, stream });
    
        peer.on('signal', (data) => {
            socket.emit('answerCall', { signal: data, to: call.from });
        });
    
        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });
    
        peer.signal(call.signal);
    
        connectionRef.current = peer;
    };

    //Hàm gọi đến người dùng (truyền vào uuid trong database)
    const callUser = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });
    
        peer.on('signal', (data) => {
            socket.emit('callUser', { userToCall: id, signalData: data, from: myself.uuid, name: myself.display_name });
        });
    
        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });
    
        socket.on('callAccepted', (signal) => {
            setCallAccepted(true);
    
            peer.signal(signal);
        });
    
        connectionRef.current = peer;
    };

    //Cúp máy
    const leaveCall = () => {
        setCallEnded(true);

        connectionRef?.current?.destroy();

        window.location.reload();
    };


    return (
        <SocketCallingContext.Provider value={{
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            callFail,
            callFailReason,
            me,
            callUser,
            leaveCall,
            answerCall,
            myself
        }}>
            { childrenComponent.children }
        </SocketCallingContext.Provider>
    );

}

export { SocketCallingContextProvider, SocketCallingContext };