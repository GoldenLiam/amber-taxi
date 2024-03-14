import React, { useState, useContext, useEffect } from 'react';
import { SocketCallingContext } from '../sockets/SocketCallingContext';
import CallingPlayer from '../components/CallingPlayer';
import CallingNotification from '../components/CallingNotification';

const CallingPage = () => {

    const socketCallingContext = useContext(SocketCallingContext);

    const { me, myself, callAccepted, name, setName, callEnded, leaveCall, callUser } = socketCallingContext;
    const [idToCall, setIdToCall] = useState('');


    return (
        <>
            <CallingPlayer/>

            <div style={{
                margin: 0,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
            }}>
                <input placeholder="Nhập uuid của người dùng để gọi" style={{padding: 10, width: "400px", borderColor: "blueviolet"}} onChange={(e) => setIdToCall(e.target.value)}/>
                <button style={{padding: 10}}
                    onClick={() => callUser(idToCall)}
                >
                    Gọi
                </button>

                <h1>Uuid của tôi là: {myself.uuid}</h1>

            </div>

            <CallingNotification/>
        </>
    );
}

export default CallingPage;