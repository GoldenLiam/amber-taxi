import React, { useContext } from 'react';
import { Modal, Button } from 'antd';
import { SocketCallingContext } from '../../sockets/SocketCallingContext';

const CallingNotification = () => {
    const { answerCall, call, callAccepted, leaveCall } = useContext(SocketCallingContext);

    const handleAnswerCall = () => {
        answerCall();
        Modal.destroyAll();
    };

    const handleCancelCall = () => {
        leaveCall()
        Modal.destroyAll();
    };

    return (
        <>
            {call.isReceivingCall && !callAccepted && (
                <Modal
                    title={`Cuộc gọi từ ${call.name}`}
                    visible={true}
                    footer={[
                        <Button key="cancel" onClick={handleCancelCall}>
                            Từ chối
                        </Button>,
                        <Button key="answer" type="primary" onClick={handleAnswerCall}>
                            Nhận cuộc gọi
                        </Button>,
                    ]}
                >
                    <p>Bạn có muốn nhận cuộc gọi?</p>
                </Modal>
            )}
        </>
    );
};

export default CallingNotification;