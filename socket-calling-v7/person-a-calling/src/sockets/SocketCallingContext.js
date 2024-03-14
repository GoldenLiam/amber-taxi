import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

// Khởi tạo context
const SocketCallingContext = createContext();

// Khởi tạo socket
const socket = io('http://localhost:5000', {autoConnect: false});


const SocketCallingContextProvider = ({ children }) => {

    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState();
    const [name, setName] = useState('');
    const [call, setCall] = useState({});
    const [me, setMe] = useState('');

    //Note biến mới
    const [myself, setMyself] = useState({});

    
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
        

        //Note gọi api ở đây để lấy thông tin cá nhân hoặc set thông tin cá nhân tùy theo biến
        setMyself(
            {
                uuid: '10JQK',
                display_name: "Person A"
            }
        );

        //Mở kết nối socket
        socket.connect();
        
        //Định danh trước khi gọi
        socket.emit('registerBeforeCalling', 
        {
            uuid: '10JQK', 
            display_name: "Person A"
        });
        
        
        /*
        // Bắt đầu gọi
        socket.emit('startCalling', "calling-room-1");
        */

        // //Phòng đầy (tránh người không liên quan vô phòng )
        // socket.on('full', (room) => {
        //     console.log("phong full");
        //     socket.disconnect();
        // });

        //Nên thêm phần gọi uuid phòng từ socket
        
        /*
        // Bắt đầu gọi
        socket.emit('startCalling', "calling-room-1");
        
        //Lắng nghe sự kiện phòng đầy
        socket.on('full', (room) => {

            console.log("phong full");
            
        });
        */

        
        //Định danh
        socket.on('me', (id) => setMe(id));

        //Ai đó gọi đến
        socket.on('callUser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivingCall: true, from, name: callerName, signal });
        });

        return () => {
            socket.disconnect();
        };

        /*
        // Bắt đầu gọi
        socket.emit('startCalling', "calling-room-1");
        
        //Lắng nghe sự kiện phòng đầy
        socket.on('full', (room) => {

            console.log("phong day");
            
        });
        */

        /*
        return () => {
            socket.disconnect();
        };
        */
        

    }, []);

    

    // //Hàm sẵn sàng để gọi và nhận cuộc gọi (hàm này được gọi trong useEffect ở page nào muốn thực hiện cuộc gọi)
    // const readyToCall = () => {
    //     // Bắt đầu gọi
    //     socket.emit('startCalling', "calling-room-1");

    //     //Phòng đầy (tránh người không liên quan vô phòng )
    //     socket.on('full', (room) => {
    //         console.log("phong full");
    //         socket.disconnect();
    //     });
    // }

    


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
        
        console.log("go here: " + id);

        const peer = new Peer({ initiator: true, trickle: false, stream });
    
        peer.on('signal', (data) => {
            socket.emit('callUser', { userToCall: id, signalData: data, from: myself.uuid, name });
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
    
        connectionRef.current.destroy();
    
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
            me,
            myself,
            callUser,
            leaveCall,
            answerCall,
        }}>
            {children}
        </SocketCallingContext.Provider>
    );

}

export { SocketCallingContextProvider, SocketCallingContext };