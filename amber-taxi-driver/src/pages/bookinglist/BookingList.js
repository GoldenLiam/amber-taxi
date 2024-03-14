// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
//Boostrap icon 5
import 'bootstrap-icons/font/bootstrap-icons.css';


import { React, useCallback, useContext, useEffect, useState } from "react";
import { MenuNavbar } from "../../components";


import { Link } from "react-router-dom";

//Thư viện antd
import { CloseCircleOutlined, FilterOutlined, SmileOutlined, UserOutlined, AppstoreOutlined, BarsOutlined, SolutionOutlined } from '@ant-design/icons';
import { Skeleton, Switch, Alert, Card, Button, Result, Typography, Select, Space, Timeline, Steps, Input, Avatar, Segmented, Flex, Empty, Modal, message } from 'antd';


import { SocketTransportationContext } from "../../sockets";
import { calculateDistance, handlingDateTime } from "../../utils";
import { beAPI } from "../../api";

const { Paragraph, Text } = Typography;


function BookingList() {
    const socketTransportationContext = useContext(SocketTransportationContext);
    const { myself, updateLocation, updateRideList, rideList, drivershift, rideForUserList, acceptRide, acceptRideResult, acceptRideResultReason } = socketTransportationContext;

    // Biến tọa độ hiện tại của tài xế
    const [currentLatitude, setCurrentLatitude] = useState(0);
    const [currentLongitude, setCurrentLongitude] = useState(0);

    // Biến cho button cập nhật
    const [loadingUpdateButton, setLoadingUpdateButton] = useState(false);

    // Biến cho segment
    const [valueSegment, setValueSegment] = useState('allride');

    // Biến messageApi để dùng hiển thị kết quả thực thi
    const [messageApi, contextHolder] = message.useMessage();

    // Biến trạng thái driver
    const [driverState, setDriverState] = useState({
        uuid: null,
        state: null,
        carId: null,
        shiftStartTime: null,
        shiftEndTime: null
    });

    const getCurrentUserPosition = async () => {
        navigator.geolocation.watchPosition(
            position => {
                /*
                accuracy: 66
                altitude: null
                altitudeAccuracy: null
                heading: null
                latitude: 10.767392754251496
                longitude: 106.74712008847548
                speed: null
                */
    
                let driverCoords = {}
    
                driverCoords.accuracy         = position.coords.accuracy;
                driverCoords.altitude         = position.coords.altitude;
                driverCoords.altitudeAccuracy = position.coords.altitudeAccuracy;
                driverCoords.heading          = position.coords.heading;
                driverCoords.latitude         = position.coords.latitude;
                driverCoords.longitude        = position.coords.longitude;
                driverCoords.speed            = position.coords.speed;
                
                updateLocation({ 
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
    
                console.log("location")
    
                setCurrentLatitude(position.coords.latitude);
                setCurrentLongitude(position.coords.longitude); 
            }
        )
    }

    const getDriverState = async () => {
        console.log("cehce")
        let driverResponse = await beAPI.get(`/driver/userId/${localStorage.getItem("uuid")}`);
        let drivershiftResponse = await beAPI.get(`/drivershift/getLatestDrivershift/${localStorage.getItem("uuid")}`);
        let driverStateObject = {
            uuid: null,
            state: null,
            carId: null,
            shiftStartTime: null,
            shiftEndTime: null
        };

        if( driverResponse.data.data ){
            driverStateObject.uuid = driverResponse.data.data.uuid;
            driverStateObject.state = driverResponse.data.data.state;
        }

        if( drivershiftResponse.data.data ){
            driverStateObject.carId = drivershiftResponse.data.data.carId;
            driverStateObject.shiftStartTime = drivershiftResponse.data.data.shiftStartTime;
            driverStateObject.shiftEndTime = drivershiftResponse.data.data.shiftEndTime;
        }
        
        if( JSON.stringify(driverStateObject) != JSON.stringify(driverState) ){
            setDriverState(driverStateObject);
        }
    }

    // Hàm driver trở nên online
    const driverGoOnline = async () => {
        console.log("go online")
        if(driverState){
            let driverUpdateResponse = await beAPI.post(`/driver/update/${driverState.uuid}`, {state: "ONLINE"});
            // Update thành công
            if (driverUpdateResponse.status == 201){
                let driverStateObject = driverState;
                driverStateObject.state = driverUpdateResponse.data.data.state;

                if( JSON.stringify(driverStateObject) != JSON.stringify(driverState) ){
                    setDriverState(driverStateObject);

                    window.location.href("/booking-list");
                }
            }
        }
    }

    // Hàm driver offline
    const driverGoOffline = async () => {
        console.log("go offline")
        if(driverState){
            let driverUpdateResponse = await beAPI.post(`/driver/update/${driverState.uuid}`, {state: "OFFLINE"});
            // Update thành công
            if (driverUpdateResponse.status == 201){
                let driverStateObject = driverState;
                driverStateObject.state = driverUpdateResponse.data.data.state;

                if( JSON.stringify(driverStateObject) != JSON.stringify(driverState) ){
                    setDriverState(driverStateObject);

                    window.location.href("/booking-list");
                }
            }
        }
    } 

    const loadingRideList = () => {
        setLoadingUpdateButton(true);
        
        updateRideList();

        setTimeout(() => {
            setLoadingUpdateButton(false);
        }, 2000);
    }

    const acceptCustomerRide = (uuid) => {
        acceptRide(uuid);
    }

    useEffect(() => {

        console.log("check effect");

        updateRideList();
        
        getDriverState();

        if( currentLatitude==0 && currentLongitude==0){
            getCurrentUserPosition();
        }

        if(acceptRideResult == true){
            messageApi.open({
                type: 'success',
                content: acceptRideResultReason,
            });
        }

        else if (acceptRideResult == false){
            messageApi.open({
                type: 'error',
                content: acceptRideResultReason,
            });
        }

    }, [acceptRideResult, driverState]);

    return (
        <>
            {contextHolder}

            <MenuNavbar />
            
            <div className="container">

                { drivershift != null &&
                    <>
                        { driverState.state == 'OFFLINE' &&
                            <>
                                <Result
                                    status="error"
                                    title="Lỗi không thể nhận cuốc"
                                    subTitle="Bạn đang offline nên không thể xem danh sách và nhận các cuốc xe."
                                    extra={[
                                        <Button type="primary" key="console" onClick={ () => {driverGoOnline()}}>
                                            Online ngay
                                        </Button>,
                                        <Button key="buy" href="/">Về trang chủ</Button>,
                                    ]}
                                >
                                    <div className="desc">
                                        <Paragraph>
                                            <Text
                                            strong
                                            style={{
                                                fontSize: 16,
                                            }}
                                            >
                                                Liên hệ ngay trung tâm hỗ trợ nếu bạn gặp các vấn đề sau:
                                            </Text>
                                        </Paragraph>

                                        <Paragraph>
                                            <CloseCircleOutlined style={{color: "red"}} className="site-result-demo-error-icon" /> Đã online những vẫn nhận thông báo này. <a>1900 &gt;</a>
                                        </Paragraph>
                                        
                                        <Paragraph>
                                            <CloseCircleOutlined style={{color: "red"}} className="site-result-demo-error-icon" /> Tài khoản bị một số hạn chế. <a>1900 &gt;</a>
                                        </Paragraph>
                                    </div>
                                </Result>
                            </>
                        }

                        { driverState.state == 'ONLINE' && new Date() > new Date(drivershift.shiftEndTime) && 
                            <>
                                <Result
                                    status="warning"
                                    title="Không thể nhận cuốc"
                                    subTitle={<>Bạn chưa có ca làm hãy liên hệ với nhân viên tại trụ sở Amber Taxi hoặc liên hệ <a>1900 &gt;</a></>}
                                    extra={
                                        <Button key="buy" href="/">Về trang chủ</Button>
                                    }
                                />
                            </>
                        }

                        {/* { currentLatitude == 0 && currentLongitude == 0 && driverState.state == 'ONLINE' && <Skeleton className="mt-5"/>} */}

                        { driverState.state == 'ONLINE' && new Date() < new Date(drivershift.shiftEndTime) &&
                            <>
                                <Alert
                                    message={<b>Bạn đang Online và sẵn sàng nhận cuốc</b>}
                                    description={<>Ca làm hiện tại của bạn: {handlingDateTime.convertISODateStringToDMYHMSTimeFormat(drivershift.shiftStartTime)} - {handlingDateTime.convertISODateStringToDMYHMSTimeFormat(drivershift.shiftEndTime)}</>}
                                    type="info"
                                    className="my-3"
                                    action={
                                        <Space direction="vertical">
                                            <Switch onChange={driverGoOffline} checkedChildren="Online" unCheckedChildren="Offline" defaultChecked/>
                                        </Space>
                                    }
                                    />

                                <div className="row">
                                    <div className="col-8">

                                        <Flex gap="large" wrap="wrap">
                                            <Segmented
                                                size="large"
                                                options={[
                                                    {
                                                        label: 'Tất cả cuốc',
                                                        value: 'allride',
                                                        icon: <BarsOutlined />,
                                                    },
                                                    {
                                                        label: 'Điều phối cho tôi',
                                                        value: 'myride',
                                                        icon: <SolutionOutlined />,
                                                    },
                                                ]}
                                                onChange={setValueSegment}
                                                className="mb-3"
                                            />

                                            <Button type="primary" size="large" loading={loadingUpdateButton} onClick={() => loadingRideList()}>
                                                Cập nhật
                                            </Button>
                                        </Flex>

                                        { valueSegment == "allride" && rideList.length == 0 && 
                                            <Empty description={
                                                <span>
                                                    Rấc tiếc vẫn chưa có cuốc xe nào
                                                </span>
                                            }/>
                                        }

                                        { valueSegment == "allride" && rideList.map((ride, i) => 
                                        <>
                                            <Card hoverable className="mb-4">
                                                <Card.Meta title={ride.full_name} className="mb-2"/>      

                                                <div>
                                                    <i className="bi bi-geo text-primary"></i> Đón tại <a href="#">{ride.starting_point.split(";")[2]} (khoảng cách {calculateDistance.calculateDistanceOneToOne( [ride.starting_point.split(";")[0], ride.starting_point.split(";")[1]], [currentLatitude, currentLongitude] ).toFixed(2)}km)</a>
                                                </div>

                                                <div>
                                                    <i className="bi bi-geo-alt text-danger"></i> Thả tại <a href="#">{ride.destination_point.split(";")[2]} (khoảng cách {calculateDistance.calculateDistanceOneToOne( [ride.destination_point.split(";")[0], ride.destination_point.split(";")[1]], [currentLatitude, currentLongitude] ).toFixed(2)}km)</a>
                                                </div>

                                                <div>
                                                    <i className="bi bi-cash text-success"></i> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ride.price)}
                                                </div>

                                                <div>
                                                    <i className="bi bi-people"></i> {ride.seat} người
                                                </div>

                                                <div>
                                                    <i className="bi bi-chat-text text-warning"></i> <i>{ride.note}</i>
                                                </div>

                                                <div className="d-flex justify-content-between align-items-center mt-2">
                                                    <div className="hstack gap-3">
                                                        <button type="button" className="btn btn-sm btn-primary" onClick={() => {
                                                            Modal.confirm({
                                                                title: 'Xác nhận',
                                                                content: `Bạn có chắc nhận cuốc xe của khách hàng ${ride.full_name}`,
                                                                footer: (_, { OkBtn, CancelBtn }) => (
                                                                    <>
                                                                        <CancelBtn />
                                                                        <Button onClick={() => { acceptCustomerRide(ride.uuid) }} type="primary">Ok</Button>
                                                                    </>
                                                                ),
                                                                centered: true,
                                                            });
                                                        }}>Nhận cuốc</button>
                                                        <div className="vr"></div>
                                                        <button type="button" className="btn btn-sm btn-outline-danger">Bỏ qua</button>
                                                    </div>

                                                    <small className="text-muted">
                                                        <i className="bi bi-clock"></i> <span></span>
                                                        {handlingDateTime.convertISODateStringToHMTimeFormat(ride.ride_start_time)}
                                                    </small>
                                                </div>
                                            </Card>
                                        </>
                                        )}

                                        { valueSegment == "myride" && rideForUserList.length == 0 &&
                                        <>
                                            <Empty description={
                                            <span>
                                                Rấc tiếc vẫn chưa có cuốc xe nào
                                            </span>
                                            }/>
                                        </> 
                                        }


                                        { valueSegment == "myride" && rideForUserList.length != 0  && rideForUserList.map((ride, i) => 
                                            <Card hoverable className="mb-4">
                                                <Card.Meta title={ride.full_name} className="mb-2"/>      

                                                <div>
                                                    <i className="bi bi-geo text-primary"></i> Đón tại <a href="#">{ride.starting_point.split(";")[2]} (khoảng cách {calculateDistance.calculateDistanceOneToOne( [ride.starting_point.split(";")[0], ride.starting_point.split(";")[1]], [currentLatitude, currentLongitude] ).toFixed(2)}km)</a>
                                                </div>

                                                <div>
                                                    <i className="bi bi-geo-alt text-danger"></i> Thả tại <a href="#">{ride.destination_point.split(";")[2]} (khoảng cách {calculateDistance.calculateDistanceOneToOne( [ride.destination_point.split(";")[0], ride.destination_point.split(";")[1]], [currentLatitude, currentLongitude] ).toFixed(2)}km)</a>
                                                </div>

                                                <div>
                                                    <i className="bi bi-cash text-success"></i> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ride.price)}
                                                </div>

                                                <div>
                                                    <i className="bi bi-people"></i> {ride.seat} người
                                                </div>

                                                <div>
                                                    <i className="bi bi-chat-text text-warning"></i> <i>{ride.note}</i>
                                                </div>

                                                <div className="d-flex justify-content-between align-items-center mt-2">
                                                    <div className="hstack gap-3">
                                                        <button type="button" className="btn btn-sm btn-primary" onClick={() => {
                                                            Modal.confirm({
                                                                title: 'Xác nhận',
                                                                content: `Bạn có chắc nhận cuốc xe của khách hàng ${ride.full_name}`,
                                                                footer: (_, { OkBtn, CancelBtn }) => (
                                                                    <>
                                                                        <CancelBtn />
                                                                        <Button onClick={() => { acceptCustomerRide(ride.uuid) }} type="primary">Ok</Button>
                                                                    </>
                                                                ),
                                                                centered: true,
                                                            });
                                                        }}>Nhận cuốc</button>
                                                        <div className="vr"></div>
                                                        <button type="button" className="btn btn-sm btn-outline-danger">Bỏ qua</button>
                                                    </div>

                                                    <small className="text-muted">
                                                        <i className="bi bi-clock"></i> <span></span>
                                                        {handlingDateTime.convertISODateStringToHMTimeFormat(ride.ride_start_time)}
                                                    </small>
                                                </div>
                                            </Card>
                                        )}

                                        

                                    </div>

                                    <div className="col-4">

                                        <Space wrap>
                                            <Select
                                                mode="multiple"
                                                allowClear
                                                style={{
                                                width: 210
                                                }}
                                                placeholder="Chọn một"
                                                maxTagCount='responsive'
                                                defaultValue={['1 chỗ']}
                                                // onChange={handleChange}
                                                options={[
                                                    {
                                                        label: "1 chỗ",
                                                        value: "1 seat",
                                                    },
                                                    {
                                                        label: "2 chỗ",
                                                        value: "2 seat",
                                                    },
                                                    {
                                                        label: "3 chỗ",
                                                        value: "3 seat",
                                                    },
                                                    {
                                                        label: "4 chỗ",
                                                        value: "4 seat",
                                                    },
                                                    {
                                                        label: "Tất cả",
                                                        value: "all seat",
                                                    },
                                                ]}
                                            />


                                            <Select
                                                showSearch
                                                placeholder="Chọn một"
                                                optionFilterProp="children"
                                                // onChange={onChange}
                                                // onSearch={onSearch}
                                                // filterOption={filterOption}
                                                style={{
                                                    width: 135
                                                }}
                                                options={[
                                                    {
                                                        value: 'normal customer',
                                                        label: 'Khách thường',
                                                    },
                                                    {
                                                        value: 'vip customer',
                                                        label: 'Khách vip',
                                                    },
                                                ]}
                                            />
                                        </Space>

                                        <Steps
                                            className="mt-3"
                                            direction="vertical"
                                            items={[
                                                {
                                                    title: 'Gần điểm đón',
                                                    status: "finish",
                                                    icon: <i className="bi bi-geo text-primary"></i>,
                                                    description: <Input size="middle" placeholder="Nhập địa điểm..."/> 
                                                },
                                                {
                                                    title: 'Gần điểm đến',
                                                    status: 'finish',
                                                    icon: <i className="bi bi-geo-alt"></i>,
                                                    description: <Input size="middle" placeholder="Nhập địa điểm..."/> 
                                                },
                                            ]}
                                        />

                                        <Button type="primary" icon={<FilterOutlined />}>
                                            Lọc
                                        </Button>
                                        

                                    </div>

                                </div>

                            </>
                        }
                    </>
                }

            </div>
        </>
    )
}

export default BookingList;