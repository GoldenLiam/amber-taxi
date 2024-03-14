import React, { useContext } from 'react';
import { Modal, Button } from 'antd';
import { SocketCallingContext } from '../../sockets/SocketCallingContext';


const CallingFailNotification = () => {

    const { callFail, callFailReason, leaveCall } = useContext(SocketCallingContext);

    const handleCancelCall = () => {
        leaveCall()
        Modal.destroyAll();
    };

    return(
        <>
            { callFail && (
                <Modal
                    title={`Không thể thực hiện cuộc gọi`}
                    visible={true}
                    footer={[
                        <Button key="cancel" onClick={handleCancelCall}>
                            Đóng
                        </Button>,
                    ]}
                >
                    { callFailReason == "This user is not currently online" && (
                        <p>Người dùng hiện tại không online</p>
                    )}

                    { callFailReason == "This user is busy now" && (
                        <p>Người dùng bận</p>
                    )}
                    
                </Modal>
            )}
        </>
    );
    
}

export default CallingFailNotification;