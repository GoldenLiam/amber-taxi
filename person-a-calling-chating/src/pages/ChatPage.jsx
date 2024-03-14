import React, { useState, useContext, useEffect } from 'react';
import { SocketChatingContext } from '../sockets/SockerChatingContext';

import { SocketChatingContextProvider } from '../sockets/SockerChatingContext';

const ChatingPage = () => {
    const socketChatingContext = useContext(SocketChatingContext);
    const { myself, sendMessage } = socketChatingContext;
    const [ message, setMessage ] = useState('');

    return(
        <>
            <div style={{
                margin: 0,
                position: "absolute",
                top: "75%",
                left: "50%",
                transform: "translate(-50%, -50%)"
            }}>
                <input placeholder="Nhập tin nhắn" style={{padding: 10, width: "400px", borderColor: "blueviolet"}} onChange={(e) => setMessage(e.target.value)}/>
                <button style={{padding: 10}}
                    onClick={() => sendMessage("JQKKA2", message)}
                >
                    Gửi
                </button>

                <h1>Uuid ride của tôi là: {myself.uuid_ride}</h1>

            </div>
        </>
    )
}

export default ChatingPage;