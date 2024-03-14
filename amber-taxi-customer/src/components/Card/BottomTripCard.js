import 'bootstrap-icons/font/bootstrap-icons.css';

import { PhoneOutlined, MessageOutlined, SafetyOutlined, EditOutlined, EllipsisOutlined, SettingOutlined, IdcardOutlined } from '@ant-design/icons';
import React, { useState, useContext, useRef } from 'react';
import { Avatar as AvatarAntd, Card, Skeleton, Dropdown  } from 'antd';

import { ChatContainer, ConversationHeader, Avatar, VoiceCallButton, 
    VideoCallButton, InfoButton, Message, MessageList, MessageSeparator, 
    MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import { Col, Divider, Drawer, List, Row, Descriptions, Badge, Tag } from 'antd';

import { SocketChatingContext } from '../../sockets';


const { Meta } = Card;
const emilyIco = "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2"
const localSender = "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2"



//Document https://chatscope.io/docs/

function BottomTripCard( {data} ) {

    const inputMessageRef = useRef();
    const socketChatingContext = useContext(SocketChatingContext);
    const { myself, sendMessage, messageList, setMessageList } = socketChatingContext;
    let {ride, customer, ridestatus, uuid,

        pickRide,
        pickRideResult,
        pickRideResultReason,
    
        denyRide,
        denyRideResult,
        denyRideResultReason,
    
        completeRide,
        completeRideResult,
        completeRideResultReason } = data;

    const handleSendMessage = (message) => {

        console.log("hello");

        sendMessage( 'JQKAA2', message );
        
        console.log(messageList);

        setMessageList([...messageList, {
            message,
            sentTime: "15 mins ago",
            direction: 'outgoing',
            position: "single"
        }])

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
                    <PhoneOutlined key="call" />,
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
                                {ridestatus.state == "ACCEPTED" && <>{ride.fullName} <Tag className='mx-2' color="#2db7f5">Đang tới điểm đón</Tag> </>}
                                {ridestatus.state == "DENIED" && <>{ride.fullName} <Tag className='mx-2' color="#f50">Đã hủy</Tag> </>}
                                {ridestatus.state == "PICKED" && <>{ride.fullName} <Tag className='mx-2' color="#108ee9">Đang tới điểm đích</Tag> </>}
                                {ridestatus.state == "DONE" && <>{ride.fullName} <Tag className='mx-2' color="#108ee9">Hoành thành</Tag> </>}
                            </>
                        }
                        
                        //{ride.fullName + ` (${ridestatus.state}) `}
                        description={ride.phone}
                    />

                </Skeleton>
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
            
            {/* Chat canvas */}
            <div style={{height: "90%"}} className="offcanvas offcanvas-bottom" tabIndex="-1" id="chatOffcanvasBottom" aria-labelledby="chatOffcanvasBottomLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="chatOffcanvasBottomLabel">Trò chuyện với khách hàng</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>

                {/* <div className="offcanvas-body"></div> */}
                <div className="offcanvas-body">

                    <ChatContainer style={{height: "100%"}}>

                        <ConversationHeader>
                            <Avatar src={emilyIco} name={ride.fullName} />
                            <ConversationHeader.Content userName={ride.fullName} info="Đang online" />
                            <ConversationHeader.Actions>
                                <InfoButton />
                            </ConversationHeader.Actions>        
                        </ConversationHeader>

                        <MessageList scrollBehavior="smooth">
                            {messageList.map((m, i) => <Message key={i} model={m} />)}
                        </MessageList>

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

                        <MessageInput onSend={handleSendMessage} ref={inputMessageRef} placeholder="Type message here" />  
                        
                    </ChatContainer>

                </div>
            </div>
            
        

        </>
        

    )
}

export default BottomTripCard;