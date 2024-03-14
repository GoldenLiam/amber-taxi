// Leaflet
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
//import 'leaflet/dist/leaflet.js'; không được import cái này
import { icon } from "leaflet";

import "leaflet-routing-machine";
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import { MapContainer, TileLayer, useMap, Marker, FeatureGroup, Popup } from 'react-leaflet'


// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";

// Soft UI Dashboard React base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
import BuildByDevelopers from "layouts/dashboard/components/BuildByDevelopers";
import WorkWithTheRockets from "layouts/dashboard/components/WorkWithTheRockets";
import Projects from "layouts/dashboard/components/Projects";
import OrderOverview from "layouts/dashboard/components/OrderOverview";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";

// React
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

// Antd
import { Steps, Button, Table, Flex, Spin, Descriptions, Avatar, Space, Row, Col, Divider, Empty, Rate, Tag } from 'antd';
import { SocketTransportationContext } from 'sockets/SocketTransportationContext';
import { beAPI } from 'api';
import { handlingDateTime } from 'utils';
import { convertISODateStringToDMYTimeFormat } from 'utils/lib/HandlingDateTime';


// Create custom marker icon
const markerIcon = icon({
    iconUrl: require("../../assets/images/marker-icon.png"),
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
});

const startingPointMarkerIcon = icon({
    iconUrl: require("../../assets/images/starting-point-marker.png"),
    iconAnchor: [24, 44], // point of the icon which will correspond to marker's location
});

const driverPointMarkerIcon = icon({
    iconUrl: require("../../assets/images/driver-marker.png"),
    iconSize: [36, 36]
})

const driverNearbyColumns = [
    {
        title: 'Tên',
        dataIndex: 'name',
    },
    {
        title: 'Model xe',
        dataIndex: 'carModel',
    },
    {
        title: 'Khoảng cách',
        dataIndex: 'distance',
    },
];


// let driverNearbyList = [
//     {
//         key: "1ba",
//         uuid: ``,
//         name: `Lưu Quang Thắng`,
//         carModel: `YARIS 1.5G CVT - 4 chỗ`,
//         distance: `1.0 km`
//     },
//     {
//         key: "1bb",
//         uuid: ``,
//         name: `Hà Quốc Toàn`,
//         carModel: `FORTUNER 2.4AT 4X2 - 7 chỗ`,
//         distance: `1.0 km`
//     }
// ];

function RideDetail() {
        
    // Map variable
    const [map, setMap] = useState(null);
    const [mapRouting, setMapRouting] = useState(null);

    
    // Biến latitude và longitude mặc định
    const [latitude, setLatitude] = useState(11.142451414209289); //latitude of Saigon River
    const [longitude, setLongitude] = useState(106.50830205050272); //longitude of Saigon River

    // Biến cho điểm đón
    const [addressStartingPointData, setAddressStartingPointData] = useState([]);
    const [addressStartingPoint, setAddressStartingPoint] = useState();

    // Biến cho điểm đến
    const [addressDestinationPointData, setAddressDestinationPointData] = useState([]);
    const [addressDestinationPoint, setAddressDestinationPoint] = useState();

    // Biến cho tài xế được chọn trong bảng
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    // Biến loading khi gửi
    const [loading, setLoading] = useState(false);

    const [loadingUpdateButton, setLoadingUpdateButton] = useState(false);

    //
    const socketTransportationContext = useContext(SocketTransportationContext);
    const { myself, findNearbyDriver, sendRideToNearbyDriver, driverNearbyList, ride, ridestatus, ridestatusList, driverRide, ratingRide} = socketTransportationContext;


    // Biến uuid của ride lấy từ params
    let { uuid } = useParams();
    

    // Hàm để lấy ride bằng uuid
    const getRide = async () => {
        // Lấy dữ liệu ride bằng uuid
        let responseRideData = await beAPI.get(`/ride/${uuid}`);
        setAddressStartingPoint(responseRideData.data.data.startingPoint);
        setAddressDestinationPoint(responseRideData.data.data.destinationPoint);

        //let responseRidestatusData = await beAPI.get(`/ridestatus/${uuid}`);
    }


    const sendRide = () => {
        setLoading(true);
        
        // Viết ajax
        sendRideToNearbyDriver(selectedRowKeys);

        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };

    // 
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        

        if( JSON.stringify(newSelectedRowKeys) != JSON.stringify(selectedRowKeys) ){
            setSelectedRowKeys(newSelectedRowKeys);
        }

    };

    // 
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        //onClick: start()
    };

    const hasSelected = selectedRowKeys.length > 0;

    // Hàm load danh sách tài xế ở gần
    const loadingNearbyDriver = () => {
        setLoadingUpdateButton(true);

        findNearbyDriver(uuid);

        setTimeout(() => {
            setLoadingUpdateButton(false);
        }, 2000);
    }


    useEffect( () => {

        if( addressDestinationPoint == null || addressDestinationPoint == null ){
            getRide();
        }

        // Set view of map to latitude, longitude
        if(map){
            map.setView([latitude, longitude], 12);

            //L.marker( [11.142451414209289, 106.50830205050272] ).addTo(map);

            if(addressStartingPoint && addressDestinationPoint){
                //Nếu routing trống
                if(!mapRouting){
                    var routingMachine = L.Routing.control({
                        waypoints: [
                            L.latLng(addressStartingPoint.split(";")[0], addressStartingPoint.split(";")[1]),
                            L.latLng(addressDestinationPoint.split(";")[0], addressDestinationPoint.split(";")[1])
                        ],
                        lineOptions: {
                            styles: [{ color: "#6FA1EC", weight: 4 }]
                        },
                        
                        createMarker: function (i, start, n){
                            var marker_icon = null;
                            if (i == 0) {
                                // This is the first marker, indicating start
                                marker_icon = startingPointMarkerIcon;
                            } else if (i == n-1) {
                                //This is the last marker indicating destination
                                marker_icon = markerIcon;
                            }

                            var marker = L.marker(start.latLng, {
                                icon: marker_icon,
                                draggable: false,
                            });
                    
                            return marker;
                        },
                
                        //addWaypoints: true,
                        routeWhileDragging: false,
                        draggableWaypoints: false,
                        //fitSelectedRoutes: true,
                        //showAlternatives: false,
                        containerClassName: 'd-none',
                        collapsible: true,
                        show: false,
                        
                    });
                    
                    setMapRouting(routingMachine);
                    map.addControl(routingMachine);
                }

                //Nếu đã có routing thì chỉ cần set waypoint
                else{
                    mapRouting.setWaypoints([
                        L.latLng(addressStartingPoint.split(";")[0], addressStartingPoint.split(";")[1]),
                        L.latLng(addressDestinationPoint.split(";")[0], addressDestinationPoint.split(";")[1])
                    ])
                    //map.addControl(mapRouting);
                }
            }

            
            driverNearbyList.forEach( item => {
                let marker = L.marker( [item.currentLocation.latitude, item.currentLocation.longitude], {icon: driverPointMarkerIcon} );
                let pop = L.popup();
                pop.setContent(item.name);

                marker.bindPopup(pop).openPopup();

                marker.addTo(map);
                //console.log(item);
            })
        }

        console.log("useeffect");

        return () => {}

    }, [map, driverNearbyList, addressStartingPoint] );

    return (
    <DashboardLayout>
        <DashboardNavbar />

        <SoftBox py={3}>

            <Card>  
                <SoftBox p={3}>

                    { ( ridestatus == null || ridestatusList == [] ) &&
                    <Steps
                        current={-1}
                        items={[
                            {
                                title: 'Chờ nhận cuốc',
                                description: "",
                            },
                            {
                                title: 'Đã nhận cuốc',
                                description: "",
                                //subTitle: '00:00:08',
                            },
                            {
                                title: 'Đã đón khách',
                                description: "",
                            },
                            {
                                title: 'Hoàn thành',
                                description: "",
                            },
                        ]}
                    />
                    }


                    { ridestatus != null && ridestatusList != [] && ridestatusList.length > 0 && ridestatus.state == 'CREATED' &&
                    <Steps
                        current={0}
                        items={[
                            {
                                title: 'Chờ nhận cuốc',
                                description: handlingDateTime.convertISODateStringToHMSTimeFormat(ridestatus.stateTime),
                            },
                            {
                                title: 'Đã nhận cuốc',
                                description: "Không có dữ liệu",
                                //subTitle: '00:00:08',
                            },
                            {
                                title: 'Đã đón khách',
                                description: "Không có dữ liệu",
                            },
                            {
                                title: 'Hoàn thành',
                                description: "Không có dữ liệu",
                            },
                        ]}
                    />
                    }


                    { ridestatus != null && ridestatusList != [] && ridestatusList.length > 0 && ridestatus.state == 'CANCELED' &&
                    <Steps
                        current={1}
                        status="error"
                        items={[
                            {
                                title: 'Chờ nhận cuốc',
                                description: handlingDateTime.convertISODateStringToHMSTimeFormat(ridestatusList[ridestatusList.length - 1].stateTime),
                            },
                            {
                                title: 'Đã hủy',
                                description: handlingDateTime.convertISODateStringToHMSTimeFormat(ridestatusList[0].stateTime),
                                subTitle: 'Khách hàng hủy',
                            },
                            {
                                title: 'Đã đón khách',
                                description: "Không có dữ liệu",
                            },
                            {
                                title: 'Hoàn thành',
                                description: "Không có dữ liệu",
                            },
                        ]}
                    />
                    }


                    { ridestatus != null && ridestatusList != [] && ridestatusList.length > 0 && ridestatus.state == 'ACCEPTED' &&
                    <Steps
                        current={1}
                        items={[
                            {
                                title: 'Chờ nhận cuốc',
                                description: handlingDateTime.convertISODateStringToHMSTimeFormat(ridestatusList[ridestatusList.length - 1].stateTime),
                            },
                            {
                                title: 'Đã nhận cuốc',
                                description: handlingDateTime.convertISODateStringToHMSTimeFormat(ridestatusList[0].stateTime),
                                //subTitle: '00:00:08',
                            },
                            {
                                title: 'Đã đón khách',
                                description: "Không có dữ liệu",
                            },
                            {
                                title: 'Hoàn thành',
                                description: "Không có dữ liệu",
                            },
                        ]}
                    />
                    }


                    { ridestatus != null && ridestatusList != [] && ridestatusList.length > 0 && ridestatus.state == 'DENIED' &&
                    <Steps
                        current={1}
                        status="error"
                        items={[
                            {
                                title: 'Chờ nhận cuốc',
                                description: handlingDateTime.convertISODateStringToHMSTimeFormat(ridestatusList[ridestatusList.length - 1].stateTime),
                            },
                            {
                                title: 'Đã hủy',
                                description: handlingDateTime.convertISODateStringToHMSTimeFormat(ridestatusList[0].stateTime),
                                subTitle: 'Tài xế hủy',
                            },
                            {
                                title: 'Đã đón khách',
                                description: "Không có dữ liệu",
                            },
                            {
                                title: 'Hoàn thành',
                                description: "Không có dữ liệu",
                            },
                        ]}
                    />
                    }


                    { ridestatus != null && ridestatusList != [] && ridestatusList.length > 0 && ridestatus.state == 'PICKED' &&
                    <Steps
                        current={2}
                        items={[
                            {
                                title: 'Chờ nhận cuốc',
                                description: handlingDateTime.convertISODateStringToHMSTimeFormat(ridestatusList[ridestatusList.length - 1].stateTime),
                            },
                            {
                                title: 'Đã nhận cuốc',
                                description: handlingDateTime.convertISODateStringToHMSTimeFormat(ridestatusList[1].stateTime),
                                //subTitle: '00:00:08',
                            },
                            {
                                title: 'Đã đón khách',
                                description: handlingDateTime.convertISODateStringToHMSTimeFormat(ridestatusList[0].stateTime),
                            },
                            {
                                title: 'Hoàn thành',
                                description: "Không có dữ liệu",
                            },
                        ]}
                    />
                    }


                    { ridestatus != null && ridestatusList != [] && ridestatusList.length > 0 && ridestatus.state == 'DONE' &&
                    <Steps
                        current={3}
                        status='finish'
                        items={[
                            {
                                title: 'Chờ nhận cuốc',
                                description: handlingDateTime.convertISODateStringToHMSTimeFormat(ridestatusList[ridestatusList.length - 1].stateTime),
                            },
                            {
                                title: 'Đã nhận cuốc',
                                description: handlingDateTime.convertISODateStringToHMSTimeFormat(ridestatusList[2].stateTime),
                                //subTitle: '00:00:08',
                            },
                            {
                                title: 'Đã đón khách',
                                description: handlingDateTime.convertISODateStringToHMSTimeFormat(ridestatusList[1].stateTime),
                            },
                            {
                                title: 'Hoàn thành',
                                description: handlingDateTime.convertISODateStringToHMSTimeFormat(ridestatusList[0].stateTime),
                            },
                        ]}
                    />
                    }
                    
                </SoftBox>
            </Card>


            <Grid container spacing={3} marginTop={1}>

                <Grid item xs={12} lg={7}>
                    <Card>

                        { ridestatus == null &&
                        <SoftBox p={2}>
                            <Spin size="large" style={{margin: 0, width: "100%"}} />
                        </SoftBox>
                        }

                        { ridestatus != null && (ridestatus.state == "CREATED" || ridestatus.state == "DENIED") && 
                        <SoftBox p={2}>

                            <h3>Điều phối</h3>

                            <div
                                style={{
                                    marginBottom: 16,
                                }}
                            >

                                <Flex gap="small" wrap="wrap">
                                
                                    <Button type="primary" loading={ loadingUpdateButton } onClick={() => loadingNearbyDriver()}>
                                        Load danh sách
                                    </Button>

                                        {/* <Button
                                        type="primary"
                                        icon={<PoweroffOutlined />}
                                        loading={loadings[1]}
                                        onClick={() => enterLoading(1)}
                                        >
                                        Click me!
                                    </Button> */}

                                    <Button type="primary" disabled={!hasSelected} loading={loading} onClick={sendRide}>
                                        Điều phối
                                    </Button>

                                    <span
                                        style={{
                                            marginLeft: 8,
                                        }}
                                    >
                                        <small> {hasSelected ? `Đã chọn ${selectedRowKeys.length} tài xế` : ''} </small>
                                    </span>
                                </Flex>

                            </div>

                            <Table size='medium' rowSelection={rowSelection} columns={driverNearbyColumns} dataSource={driverNearbyList} />

                        </SoftBox>
                        }


                        { ridestatus != null && driverRide != null && (ridestatus.state == "ACCEPTED" || ridestatus.state == "PICKED") && 
                        <SoftBox p={2}>
                            <Flex style={{width: '100%'}} align="center" vertical>
                                <div>
                                    <Avatar size={64} style={{border: '2px solid #fff769', padding: '2px'}}  src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2" />
                                </div>

                                <Descriptions title={
                                    <Divider orientation="left" orientationMargin="0">
                                        Thông tin tài xế
                                    </Divider>
                                } column={2}>
                                    <Descriptions.Item label="Họ và tên">{driverRide.user.fullName}</Descriptions.Item>
                                    <Descriptions.Item label="Giới tính">{driverRide.user.gender}</Descriptions.Item>
                                    <Descriptions.Item label="Số điện thoại">{driverRide.user.phone}</Descriptions.Item>
                                    <Descriptions.Item label="Căn cước công dân">{driverRide.user.cic}</Descriptions.Item>
                                    <Descriptions.Item label="Ngày sinh">{handlingDateTime.convertISODateStringToDMYTimeFormat(driverRide.user.dob)}</Descriptions.Item>
                                    <Descriptions.Item label="Số bằng lái">{driverRide.drivingLicenceNumber}</Descriptions.Item>
                                    <Descriptions.Item label="Ngày hết hạn">{handlingDateTime.convertISODateStringToDMYTimeFormat(driverRide.expiryDate)}</Descriptions.Item>
                                </Descriptions>
                            </Flex>

                            <div>
                                <Descriptions title={
                                    <Divider orientation="left" orientationMargin="0">
                                        Thông tin chuyến đi
                                    </Divider>
                                } column={2}>
                                    <Descriptions.Item label="Tên khách hàng">{ride.fullName}</Descriptions.Item>
                                    <Descriptions.Item label="Giới tính">{ride.gender == "male" ? "Nam" : "Nữ"}</Descriptions.Item>
                                    <Descriptions.Item label="Số điện thoại">{ride.phone}</Descriptions.Item>
                                    <Descriptions.Item label="Số người">{ride.seat}</Descriptions.Item>
                                    <Descriptions.Item label="Thời gian bắt đầu">{handlingDateTime.convertISODateStringToDMYTimeFormat(ride.rideStartTime)}</Descriptions.Item>
                                    <Descriptions.Item label="Điểm đón">{ride.startingPoint.split(";")[2]}</Descriptions.Item>
                                    <Descriptions.Item label="Điến đến">{ride.destinationPoint.split(";")[2]}</Descriptions.Item>
                                    <Descriptions.Item label="Quãng đường">{ride.distance + " km"}</Descriptions.Item>
                                    <Descriptions.Item label="Giá tiền">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ride.price)}</Descriptions.Item>
                                </Descriptions>
                            </div>
                        </SoftBox>
                        }

                        { ridestatus != null && (ridestatus.state == "DONE") && driverRide != null && 
                        <SoftBox p={2}>
                            <Flex style={{width: '100%'}} align="center" vertical>
                                <div>
                                    <Avatar size={64} style={{border: '2px solid #fff769', padding: '2px'}}  src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2" />
                                </div>

                                <Descriptions title={
                                    <Divider orientation="left" orientationMargin="0">
                                        Thông tin tài xế
                                    </Divider>
                                } column={2}>
                                    <Descriptions.Item label="Họ và tên">{driverRide.user.fullName}</Descriptions.Item>
                                    <Descriptions.Item label="Giới tính">{driverRide.user.gender}</Descriptions.Item>
                                    <Descriptions.Item label="Số điện thoại">{driverRide.user.phone}</Descriptions.Item>
                                    <Descriptions.Item label="Căn cước công dân">{driverRide.user.cic}</Descriptions.Item>
                                    <Descriptions.Item label="Ngày sinh">{handlingDateTime.convertISODateStringToDMYTimeFormat(driverRide.user.dob)}</Descriptions.Item>
                                    <Descriptions.Item label="Số bằng lái">{driverRide.drivingLicenceNumber}</Descriptions.Item>
                                    <Descriptions.Item label="Ngày hết hạn">{handlingDateTime.convertISODateStringToDMYTimeFormat(driverRide.expiryDate)}</Descriptions.Item>
                                </Descriptions>
                            </Flex>

                            <div>
                                <Descriptions title={
                                    <Divider orientation="left" orientationMargin="0">
                                        Thông tin chuyến đi
                                    </Divider>
                                } column={2}>
                                    <Descriptions.Item label="Tên khách hàng">{ride.fullName}</Descriptions.Item>
                                    <Descriptions.Item label="Giới tính">{ride.gender == "male" ? "Nam" : "Nữ"}</Descriptions.Item>
                                    <Descriptions.Item label="Số điện thoại">{ride.phone}</Descriptions.Item>
                                    <Descriptions.Item label="Số người">{ride.seat}</Descriptions.Item>
                                    <Descriptions.Item label="Thời gian bắt đầu">{handlingDateTime.convertISODateStringToDMYTimeFormat(ride.rideStartTime)}</Descriptions.Item>
                                    <Descriptions.Item label="Điểm đón">{ride.startingPoint.split(";")[2]}</Descriptions.Item>
                                    <Descriptions.Item label="Điến đến">{ride.destinationPoint.split(";")[2]}</Descriptions.Item>
                                    <Descriptions.Item label="Quãng đường">{ride.distance + " km"}</Descriptions.Item>
                                    <Descriptions.Item label="Giá tiền">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ride.price)}</Descriptions.Item>
                                </Descriptions>
                            </div>

                            <div>
                                {ratingRide == null && 
                                    <>
                                        <Divider orientation="left" orientationMargin="0">
                                            Đánh giá
                                        </Divider>
                                        <Empty
                                            description={
                                            <span>
                                                Khách hàng chưa đánh giá
                                            </span>
                                            }
                                        >
                                        </Empty>
                                    </>
                                }

                                {ratingRide != null && 
                                    <>
                                        <Descriptions title={
                                            <Divider orientation="left" orientationMargin="0">
                                                Đánh giá
                                            </Divider>
                                        } column={2}>
                                            <Descriptions.Item label="Điểm đánh giá"><Rate disabled defaultValue={ratingRide.ratingValue} /></Descriptions.Item>
                                            <Descriptions.Item label="Tag">{ratingRide.ratingTag != null ? ratingRide.ratingTag.split(";").map((tag, i) => <Tag key={i} bordered={false} color="gold">{tag}</Tag> ) : ""}</Descriptions.Item>
                                            <Descriptions.Item label="Bình luận">{ratingRide.ratingComment}</Descriptions.Item>
                                            <Descriptions.Item label="Thời gian đánh giá">{handlingDateTime.convertISODateStringToDMYHMSTimeFormat(ratingRide.ratingTime)}</Descriptions.Item>
                                        </Descriptions>
                                    </>
                                }
                            </div>
                        </SoftBox>
                        }
                    </Card>
                </Grid>

                <Grid item xs={12} lg={5}>
                    <Card>
                        <SoftBox p={2}>
                            
                            <h3>Bản đồ</h3>

                            <MapContainer minZoom='5' maxZoom='18' ref={setMap} style={{ width: "100%", height: "650px"}} center={[latitude, longitude]} scrollWheelZoom={true}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                            </MapContainer>

                        </SoftBox>
                    </Card>
                </Grid>
            </Grid>

        </SoftBox>

        <Footer />
    </DashboardLayout>
    );
}

export default RideDetail;
