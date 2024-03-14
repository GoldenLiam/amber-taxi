import React, { useContext } from 'react';
import { SocketCallingContext } from '../../sockets/SocketCallingContext';

const CallingPlayer = () => {
    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketCallingContext);

    return (
        <>
            {stream && (
                // <video playsInline muted ref={myVideo} autoPlay />
                <video playsInline muted ref={myVideo} autoPlay />
            )}

            {callAccepted && !callEnded && (
                <video playsInline ref={userVideo} autoPlay />
            )}
        </>
    );

}

export default CallingPlayer;