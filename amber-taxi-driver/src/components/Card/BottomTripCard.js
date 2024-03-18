import 'bootstrap-icons/font/bootstrap-icons.css';

import { PhoneOutlined, MessageOutlined, SafetyOutlined, EditOutlined, EllipsisOutlined, SettingOutlined, IdcardOutlined } from '@ant-design/icons';
import React, { useState, useContext, useRef } from 'react';
import { Avatar as AvatarAntd, Card, Skeleton, Dropdown  } from 'antd';

import { MainContainer, ChatContainer, ConversationHeader, Avatar, VoiceCallButton, 
    VideoCallButton, InfoButton, Message, MessageList, MessageSeparator, 
    MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import { Col, Divider, Drawer, List, Row, Descriptions, Badge, Tag, Steps, Button as ButtonAntd, Flex } from 'antd';

import { SocketChatingContext } from '../../sockets';
import { SocketCallingContext } from '../../sockets';

const { Meta } = Card;
const emilyIco = "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2"
const localSender = "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2"



//Document https://chatscope.io/docs/

function BottomTripCard( {props} ) {

    const inputMessageRef = useRef();
    const socketChatingContext = useContext(SocketChatingContext);
    const { myself, sendMessageSocket, messageList, setMessageList } = socketChatingContext;
    
    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call, answerCall, callUser } = useContext(SocketCallingContext);

    
    let {ride, customer, ridestatus, uuid,

        pickRide,
        pickRideResult,
        pickRideResultReason,
    
        denyRide,
        denyRideResult,
        denyRideResultReason,
    
        completeRide,
        completeRideResult,
        completeRideResultReason } = props;



    const handleSendMessage = (message) => {

        // console.log("hello");

        // sendMessage( 'JQKAA2', message );
        
        // console.log(messageList);

        // setMessageList([...messageList, {
        //     message,
        //     sentTime: "15 mins ago",
        //     direction: 'outgoing',
        //     position: "single"
        // }])
        sendMessageSocket( customer.uuid, message );

        inputMessageRef.current.focus();
    }

    const changeStateRide = (e) => {
        //console.log(e)
        if(e.key == 0){
            pickRide(uuid);
        }
        if(e.key == 1){
            completeRide(uuid);
        }
        if(e.key == 2){
            denyRide(uuid);
        }
    }

    const items = [
        {
            label: 'Đã đón khách',
            key: '0',
            onClick: changeStateRide
        },
        {
            label: 'Đã hoàn thành',
            key: '1',
            onClick: changeStateRide
        },
        {
            type: 'divider',
        },
        {
            label: 'Hủy chuyến đi',
            key: '2',
            onClick: changeStateRide
        },
    ];

    return (
        <>
            <Card
                actions={[
                    <PhoneOutlined key="call" data-bs-toggle="offcanvas" data-bs-target="#callOffcanvasBottom" aria-controls="callOffcanvasBottom"/>,
                    <MessageOutlined key="message" data-bs-toggle="offcanvas" data-bs-target="#chatOffcanvasBottom" aria-controls="chatOffcanvasBottom"/>,
                    <IdcardOutlined key="detail" data-bs-toggle="offcanvas" data-bs-target="#detailOffcanvasRight" aria-controls="detailOffcanvasRight"/>,

                    <Dropdown
                        menu={{
                            items,
                        }}
                        trigger={['click']}
                    >
                        <a >
                            <EllipsisOutlined />
                        </a>
                    </Dropdown>,
                    
                ]}
            >
                <Skeleton loading={false} avatar active>
                    
                    <Meta
                        avatar={<AvatarAntd src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2" size="large" style={{border: '2px solid #F37021', padding: '2px'}} />}
                        title={
                            <>
                                {ridestatus.state == "ACCEPTED" && <>{ride.fullName} <Tag className='mx-2' color="purple">Đang tới điểm đón</Tag> </>}
                                {ridestatus.state == "DENIED" && <>{ride.fullName} <Tag className='mx-2' color="warning">Đã hủy</Tag> </>}
                                {ridestatus.state == "PICKED" && <>{ride.fullName} <Tag className='mx-2' color="processing">Đang tới điểm đích</Tag> </>}
                                {ridestatus.state == "DONE" && <>{ride.fullName} <Tag className='mx-2' color="success">Hoành thành</Tag> </>}
                            </>
                        }
                        
                        //{ride.fullName + ` (${ridestatus.state}) `}
                        description={ride.phone}
                    />

                </Skeleton>
                
                {/* Call player */}
                <div>
                    {stream && (
                        // <video playsInline muted ref={myVideo} autoPlay />
                        <video playsInline muted ref={myVideo} autoPlay />
                    )}

                    {callAccepted && !callEnded && (
                        <video playsInline ref={userVideo} autoPlay />
                    )}
                </div>
            </Card>
            
            {/* Detail canvas */}
            <div class="offcanvas offcanvas-end" tabIndex="-1" id="detailOffcanvasRight" aria-labelledby="detailOffcanvasRightLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="detailOffcanvasRightLabel">Chi tiết cuốc đi</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">

                    <Descriptions title={<><i class="bi bi-person"></i> Thông tin khách hàng</>} layout='horizontal' column={1}>
                        <Descriptions.Item label="Tên khách hàng">{ride.fullName} </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">{ride.phone}</Descriptions.Item>
                        <Descriptions.Item label="Giới tính">{ride.gender == "male" ? "Nam" : "Nữ"}</Descriptions.Item>
                        <Descriptions.Item label="Số người">{ride.seat}</Descriptions.Item>
                        <Descriptions.Item label="Ghi chú">{ride.note}</Descriptions.Item>
                    </Descriptions>
                    
                    <Divider/>

                    <Descriptions title={<><i class="bi bi-pin-map"></i> Thông tin chuyến đi</>} layout='horizontal' column={1}>
                        <Descriptions.Item label="Điểm đón">{ride.startingPoint != null ? ride.startingPoint.split(";")[2] : ""} </Descriptions.Item>
                        <Descriptions.Item label="Điểm đến">{ride.destinationPoint != null ? ride.destinationPoint.split(";")[2] : ""} </Descriptions.Item>
                        <Descriptions.Item label="Khoảng cách">{ride.distance + " km"}</Descriptions.Item>
                        <Descriptions.Item label="Tổng tiền">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ride.price)}</Descriptions.Item>
                    </Descriptions>

                </div>
            </div>


            {/* Call canvas */}
            <div className="offcanvas offcanvas-bottom" tabIndex="-1" id="callOffcanvasBottom" aria-labelledby="callOffcanvasBottomLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="chatOffcanvasBottomLabel">Gọi điện với khách hàng</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>

                <div className="offcanvas-body">
                    {customer != null && 

                        <>
                        {call.isReceivingCall && !callAccepted && (
                        <>
                            <h1>Khách hàng {call.name} đang gọi cho bạn</h1>
                            <ButtonAntd  type='primary' onClick={answerCall}> Nghe máy</ButtonAntd>
                        </>
                        )}

                        {!call.isReceivingCall && 
                        <Flex gap="middle" align="start" vertical>
                            <Flex style={{width: '100%'}} justify={"space-evenly"} align={"center"}>
                                <ButtonAntd href={`tel:${ride.phone}`} type="default" shape="round" icon={<i class="bi bi-sim"></i>} size={"large"} >Gọi bằng số điện thoại</ButtonAntd>
                                <ButtonAntd  onClick={() => callUser(customer.uuid)} type="primary" shape="round" icon={<i class="bi bi-telephone-fill"></i>}  size={"large"} >Gọi điện trực tiếp</ButtonAntd>
                            </Flex>
                        </Flex>
                        }

                        {callAccepted && (
                            <>
                            <h1>Bạn đang trong cuộc gọi</h1>
                            <small></small>
                            <ButtonAntd type='primary' > Cúp máy</ButtonAntd>
                            </>
                        )}

                        </>
                    }

                    {customer == null && 
                        <Flex gap="middle" align="start" vertical>
                            <Flex style={{width: '100%'}} justify={"space-evenly"} align={"center"}>
                                <ButtonAntd href={`tel:${ride.phone}`} type="default" shape="round" icon={<i class="bi bi-sim"></i>} size={"large"} >Gọi bằng số điện thoại</ButtonAntd>
                            </Flex>
                        </Flex>
                    }
                </div>
            </div>

            
            {/* Chat canvas */}
            <div style={{height: "90%"}} className="offcanvas offcanvas-bottom" tabIndex="-1" id="chatOffcanvasBottom" aria-labelledby="chatOffcanvasBottomLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="chatOffcanvasBottomLabel">Trò chuyện với khách hàng</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>

                {/* <div className="offcanvas-body"></div> */}
                <div className="offcanvas-body">
                    
                    <MainContainer>
                        <ChatContainer style={{height: "100%"}}>

                            <ConversationHeader>
                                <Avatar src={emilyIco} name={ride.fullName} />
                                <ConversationHeader.Content userName={ride.fullName} info={<><Badge className='mx-1' status="processing" text="Đang online"/></>} />
                                <ConversationHeader.Actions>
                                    <InfoButton />
                                </ConversationHeader.Actions>        
                            </ConversationHeader>

                            <MessageList scrollBehavior="smooth">

                                {messageList.map( messageData => {
                                    return (
                                    <Message key={messageData.uuid} model={{
                                        message: messageData.message,
                                        sender: messageData.senderId,
                                        direction: messageData.senderId == localStorage.getItem("uuid") ? "outgoing" : "incoming",
                                        position: "single"
                                    }}/>
                                    )
                                })}
                                
                            </MessageList>

                            <MessageInput onSend={handleSendMessage} ref={inputMessageRef} placeholder="Nhập tin nhắn ở đây" />  


                            {/* <MessageList typingIndicator={<TypingIndicator content="Emily is typing" />}>
                            
                                <MessageSeparator content="Saturday, 30 November 2019" />
                                
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    sender: "Emily",
                                    direction: "incoming",
                                    position: "single"
                                }}>
                                    <Avatar src={emilyIco} name={"Emily"} />
                                </Message>

                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    sener: localSender,
                                    direction: "outgoing",
                                    position: "single"
                                }} />
                                
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    sender: "Emily",
                                    direction: "incoming",
                                    position: "first"
                                }} avatarSpacer />
                                
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    sender: "Emily",
                                    direction: "incoming",
                                    position: "normal"
                                }} avatarSpacer />
                                
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    sender: "Emily",
                                    direction: "incoming",
                                    position: "normal"
                                }} avatarSpacer />
                                
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    sender: "Emily",
                                    direction: "incoming",
                                    position: "last"
                                }}>
                                    <Avatar src={emilyIco} name={"Emily"} />
                                </Message>
                                    
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    direction: "outgoing",
                                    position: "first"
                                }} />
                                
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    direction: "outgoing",
                                    position: "normal"
                                }} />

                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    direction: "outgoing",
                                    position: "normal"
                                }} />

                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    direction: "outgoing",
                                    position: "last"
                                }} />
                                    
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    sender: "Emily",
                                    direction: "incoming",
                                    position: "first"
                                }} avatarSpacer />

                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    sender: "Emily",
                                    direction: "incoming",
                                    position: "last"
                                }}>
                                    <Avatar src={emilyIco} name={"Emily"} />
                                </Message>
                                    
                                <MessageSeparator content="Saturday, 31 November 2019" />
                                    
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    sender: "Emily",
                                    direction: "incoming",
                                    position: "single"
                                }}>
                                    <Avatar src={emilyIco} name={"Emily"} />
                                </Message>
                                
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    sener: localSender,
                                    direction: "outgoing",
                                    position: "single"
                                }} />
                                
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    sender: "Emily",
                                    direction: "incoming",
                                    position: "first"
                                }} avatarSpacer />
                                
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    sender: "Emily",
                                    direction: "incoming",
                                    position: "normal"
                                }} avatarSpacer />
                                
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    sender: "Emily",
                                    direction: "incoming",
                                    position: "normal"
                                }} avatarSpacer />
                                
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    sender: "Emily",
                                    direction: "incoming",
                                    position: "last"
                                }}>
                                    <Avatar src={emilyIco} name={"Emily"} />
                                </Message>
                                
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    direction: "outgoing",
                                    position: "first"
                                }} />
                                
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    direction: "outgoing",
                                    position: "normal"
                                }} />
                                
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    direction: "outgoing",
                                    position: "normal"
                                }} />
                                
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    direction: "outgoing",
                                    position: "last"
                                }} />
                                        
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    sender: "Emily",
                                    direction: "incoming",
                                    position: "first"
                                }} avatarSpacer />
                                
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "15 mins ago",
                                    sender: "Emily",
                                    direction: "incoming",
                                    position: "last"
                                }}>
                                    <Avatar src={emilyIco} name={"Emily"} />
                                </Message>
                            
                            </MessageList> */}

                        </ChatContainer>
                    </MainContainer>

                </div>
            </div>
            
        

        </>
        

    )
}

export default BottomTripCard;