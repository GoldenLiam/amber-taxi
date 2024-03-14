import React, { useContext, useState, useRef, useEffect } from 'react';
import { SocketCallingContext } from "../sockets/SocketCallingContext";

const CallingNotification = () => {

    const { answerCall, call, callAccepted } = useContext(SocketCallingContext);

    return  (
        <> 
            {call.isReceivingCall && !callAccepted && (
                <>
                    <h1>Người với định danh {call.name} đang gọi cho bạn</h1>
                    <button onClick={answerCall}> Nhận cuộc gọi </button>
                </>
            )}
        </>
    )
}

export default CallingNotification;