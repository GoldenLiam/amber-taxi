import React, { useState, useContext, useEffect } from 'react';
import { SocketCallingContext } from '../../sockets/SocketCallingContext';
import CallingPlayer from '../../components/Calling/CallingPlayer';
import CallingFailNotification from '../../components/Calling/CallingFailNotificatoin';
import { PhoneOutlined, CloseOutlined } from '@ant-design/icons';

const CallingPage = () => {
    const socketCallingContext = useContext(SocketCallingContext);
    const { me, myself, callAccepted, name, setName, callEnded, leaveCall, callUser } = socketCallingContext;
    const [idToCall, setIdToCall] = useState('');
    const [callStarted, setCallStarted] = useState(false);
    const [callDuration, setCallDuration] = useState(0);

    useEffect(() => {
        let interval = null;

        if (callStarted && !callEnded) {
            interval = setInterval(() => {
                setCallDuration((prevDuration) => prevDuration + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [callStarted, callEnded]);

    const handleCallButtonClick = () => {
        if (idToCall !== '') {
            callUser(idToCall);
            setCallStarted(true);
        }
    };

    const handleHangUpButtonClick = () => {
        leaveCall();
        setCallDuration(0);
        setCallStarted(false);
    };

    const formatCallDuration = (duration) => {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;

        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    };

    useEffect(() => {
        if (callAccepted) {
            setCallStarted(true);
        }
    }, [callAccepted]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    style={{
                        width: '240px',
                        height: '48px',
                        marginRight: '8px',
                        borderRadius: '24px',
                        backgroundColor: '#fff',
                        color: '#000',
                        padding: '0 16px',
                        border: '1px solid #ccc',
                        outline: 'none',
                    }}
                    placeholder='Nhập uuid của người để gọi'
                    onChange={(e) => setIdToCall(e.target.value)}
                />
                {callAccepted ? (
                    <button
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundColor: '#FF3B30',
                            color: '#fff',
                            border: 'none',
                            outline: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onClick={handleHangUpButtonClick}
                    >
                        <CloseOutlined />
                    </button>
                ) : (
                    <button
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundColor: '#28A745',
                            color: '#fff',
                            border: 'none',
                            outline: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onClick={handleCallButtonClick}
                        disabled={callStarted || idToCall === ''}
                    >
                        <PhoneOutlined />
                    </button>
                )}
            </div>

            {callAccepted && (
                <div>
                    <p style={{ marginTop: '10px' }}>{formatCallDuration(callDuration)}</p>
                    {/* <button
                        style={{
                            padding: '8px',
                            backgroundColor: '#FF3B30',
                            color: '#fff',
                            borderRadius: '4px',
                            border: 'none',
                            outline: 'none',
                            cursor: 'pointer',
                            marginTop: '16px',
                        }}
                        onClick={handleHangUpButtonClick}
                    >
                        Kết thúc cuộc gọi
                    </button> */}
                </div>
            )}

            <h3 style={{ marginTop: '24px' }}>Uuid của bạn là: {myself.uuid}</h3>
            
            <CallingFailNotification/>
            
            <CallingPlayer />
        </div>
    );
};

export default CallingPage;