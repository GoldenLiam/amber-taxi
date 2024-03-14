import { useEffect, useState, useContext } from "react"
import L from "leaflet";
import "leaflet-routing-machine";
import { verifyUser } from "../../services/UserService"
import { useNavigate } from "react-router-dom"
import { Button, Modal, DatePicker, Form, Input, Switch, TimePicker, message } from 'antd'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/leaflet.js'
import { icon } from "leaflet"
import { createRide } from "../../services/RideService";
import { convertPickerDateToDBDate, convertPickerTimeToDBTime } from "../../utils/HandleDateTime";

// Css
import '../../assets/css/sb-admin-2.min.css';
import '../../assets/vendor/fontawesome-free/css/all.min.css';
// Component 
import LeftSideNavBar from '../../components/LeftSideNavBar/LeftSideNavBar';
import TopNavBar from '../../components/TopNavBar/TopNavBar';
// import BottomFooter from '../../components/BottomFooter/BottomFooter';
import EarningLineChart from '../../components/Chart/Line/EarningLineChart';
import RevenuePieChart from '../../components/Chart/Pie/RevenuePieChart';
import DataCard from "../../components/DataCard/DataCard";
import { SocketCallingContext, SocketCallingContextProvider } from "../../sockets/SocketCallingContext";

const HomePage = () => {
    const [auth, setAuth] = useState(false)
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [formData, setFormData] = useState({
        customerName: '',
        phoneNumber: '',
        startDate: null,
        appointment: 0,
        startTime: null,
        addressStartingPoint: '19 nguyen huu tho, phuong tan phong, quan 7 , ho chi minh',
        addressDestinationPoint: '1063 le van luong, xa phuoc kien, huyen nha be, ho chi minh',
        distance: '',
        price: '',
    })
    //Biến map
    //Biến tọa độ hiện tại của người dùng
    const [startLat, setStartLat] = useState(0);
    const [startLng, setStartLng] = useState(0);
    const [map, setMap] = useState(null);

    const [firstLoad, setFirstLoad] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);

    };
    const handleOk = async () => {

        let cloneFormData = Object.assign({}, formData);

        cloneFormData.startDate = convertPickerDateToDBDate(cloneFormData.startDate);
        cloneFormData.startTime = convertPickerTimeToDBTime(cloneFormData.startTime);

        const res = await createRide(cloneFormData)
        console.log(res.message)
        if (res.status === 'OK') {
            messageApi.open({
                type: 'success',
                content: res.message,
            });
            setFormData({
                customerName: '',
                phoneNumber: '',
                startDate: null,
                appointment: 0,
                startTime: NaN,
                addressStartingPoint: '',
                addressDestinationPoint: '',
                distance: '',
                price: '',
            });
            setIsModalOpen(false);
        } else {
            messageApi.open({
                type: 'error',
                content: res.message,
            });
        }
    };

    const handleCancel = () => {
        setFormData({
            customerName: '',
            phoneNumber: '',
            startDate: null,
            appointment: 0,
            startTime: null,
            addressStartingPoint: '',
            addressDestinationPoint: '',
            distance: '',
            price: '',
        });
        setIsModalOpen(false);
    };

    const markerIcon = icon({
        iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-red.png'
    })

    //Lấy tọa độ hiện tại và refresh lại view
    async function getCurrentUserPosition() {
        await navigator.geolocation.getCurrentPosition(
            position => {
                if (map !== null) {
                    if (firstLoad === false) {
                        map.setView([startLat, startLng], 13);
                        setStartLat(position.coords.latitude);
                        setStartLng(position.coords.longitude);
                    }
                    //https://github.com/perliedman/leaflet-routing-machine/issues/20 (fixed)
                }
            },
            err => console.log(err)
        );
    };

    getCurrentUserPosition();

    const handleSearch = async (e) => {
        e.preventDefault();
        setFirstLoad(true);
        try {
            const startingResponse = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                    formData.addressStartingPoint
                )}&format=json&limit=1`
            );

            const destinationResponse = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                    formData.addressDestinationPoint
                )}&format=json&limit=1`
            );

            const startingPoint = await startingResponse.json()
            const destinationPoint = await destinationResponse.json()

            if (startingPoint && startingPoint.length > 0 && destinationPoint && destinationPoint.length > 0) {
                const startLat = parseFloat(startingPoint[0].lat);
                const startLng = parseFloat(startingPoint[0].lon);
                const endLat = parseFloat(destinationPoint[0].lat);
                const endLng = parseFloat(destinationPoint[0].lon);

                setStartLat(startLat);
                setStartLng(startLng);

                map.setView([startLat, startLng], 13);

                let leafletElement = L.Routing.control({
                    waypoints: [
                        //10.729753960741485, 106.69989835053133
                        L.latLng(startLat, startLng),
                        L.latLng(endLat, endLng)
                    ],
                    lineOptions: {
                        styles: [{ color: "#6FA1EC", weight: 4 }]
                    },

                    createMarker: function (i, start, n) {
                        var marker_icon = null
                        if (i === 0) {
                            // This is the first marker, indicating start
                            marker_icon = markerIcon;
                        } else if (i === n - 1) {
                            //This is the last marker indicating destination
                            marker_icon = markerIcon;
                        }
                        var marker = L.marker(start.latLng, {
                            icon: marker_icon
                        })

                        return marker
                    },

                    addWaypoints: false,
                    routeWhileDragging: false,
                    draggableWaypoints: false,
                    fitSelectedRoutes: true,
                    showAlternatives: false,

                    show: true
                }).addTo(map);

                leafletElement.on('routeselected', function (e) {
                    var totalDistance = e.route.summary.totalDistance;
                    var distance = (totalDistance / 1000).toFixed(1);
                    var totalPrice = 0 
                    if(distance > 30) {
                        totalPrice = 30 * 12 + (distance - 30) * 10
                    } else {
                        totalPrice = distance * 12
                    }
                    setFormData({ ...formData, distance: distance, price: totalPrice.toFixed(0) })
                });
            }
        } catch (error) {
            console.error('Error geocoding address:', error);
        }
    };
    const socketCallingContext = useContext(SocketCallingContext);
    const { me } = socketCallingContext;

    useEffect(() => {
        const fetchData = async () => {
            const res = await verifyUser();
            if (res.status === 'OK') {
                setAuth(true);
            } else {
                navigate('/login')
            }
        };
        fetchData();
    }, [auth, navigate]);

    return (
        <>
            {contextHolder}
            <div id="wrapper">
                <LeftSideNavBar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <TopNavBar />
                        <div className="container-fluid">
                            {/* Page Heading */}
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
                                <Button type="primary" onClick={showModal} style={{ height: '40px' }}>
                                    TẠO CUỐC XE
                                </Button>
                            </div>

                            {/* Content Row */}
                            <DataCard />

                            {/* Content Row */}
                            <div className="row">
                                {/* Area Chart */}
                                <div className="col-xl-7 col-lg-7">
                                    <div className="card shadow mb-4">
                                        {/* Card Header */}
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">Earnings Overview</h6>
                                        </div>
                                        {/* Card Body */}
                                        <div className="card-body">
                                            <EarningLineChart />
                                        </div>
                                    </div>
                                </div>

                                {/* Pie Chart */}
                                <div className="col-xl-5 col-lg-5">
                                    <div className="card shadow mb-4">
                                        {/* Card Header */}
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">Revenue Sources</h6>
                                        </div>
                                        {/* Card Body */}
                                        <div className="card-body">
                                            <div className="chart-pie pt-4 pb-2">
                                                <RevenuePieChart />
                                            </div>
                                            <div className="mt-4 text-center small">
                                                <span className="mr-2"> <i className="fas fa-circle text-primary"></i> Direct </span>
                                                <span className="mr-2"> <i className="fas fa-circle text-success"></i> Social </span>
                                                <span className="mr-2"> <i className="fas fa-circle text-info"></i> Referral </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Modal title="Tạo Cuốc Xe" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                            <Form
                                labelCol={{
                                    span: 6,
                                }}
                                wrapperCol={{
                                    span: 14,
                                }}
                                layout="horizontal"
                                style={{
                                    maxWidth: 600,
                                }}
                            >
                                <Form.Item label="Tên khách hàng">
                                    <Input
                                        value={formData.customerName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, customerName: e.target.value })
                                        }
                                    />
                                </Form.Item>
                                <Form.Item label="Số điện thoại">
                                    <Input
                                        value={formData.phoneNumber}
                                        onChange={(e) =>
                                            setFormData({ ...formData, phoneNumber: e.target.value })
                                        }
                                    />
                                </Form.Item>
                                <Form.Item label="Ngày tạo cuốc">
                                    <DatePicker
                                        value={formData.startDate}
                                        onChange={(date) =>
                                            setFormData({ ...formData, startDate: date })
                                        }
                                    />
                                </Form.Item>
                                <Form.Item label="Hẹn giờ" valuePropName="checked">
                                    <Switch
                                        checked={formData.appointment}
                                        onChange={(checked) =>
                                            setFormData({ ...formData, appointment: checked ? 1 : 0 })
                                        }
                                    />
                                </Form.Item>
                                <Form.Item name="time-picker" label="Thời gian bắt đầu">
                                    <TimePicker
                                        value={formData.startTime}
                                        onChange={(time) =>
                                            setFormData({ ...formData, startTime: time })
                                        }
                                    />
                                </Form.Item>
                                <Form.Item label="Điểm bắt đầu">
                                    <Input
                                        value={formData.addressStartingPoint}
                                        onChange={(e) =>
                                            setFormData({ ...formData, addressStartingPoint: e.target.value })
                                        }
                                    />
                                </Form.Item>
                                <Form.Item label="Điểm đến">
                                    <Input
                                        value={formData.addressDestinationPoint}
                                        onChange={(e) =>
                                            setFormData({ ...formData, addressDestinationPoint: e.target.value })
                                        }
                                    />
                                    <Button onClick={handleSearch} style={{ marginTop: '8px' }}>Tìm</Button>
                                </Form.Item>
                                <Form.Item label="Quãng đường">
                                    {formData.distance && <Input value={formData.distance + " km"} readOnly />}
                                </Form.Item>
                                <Form.Item label="Thành tiền">
                                    {formData.price && <Input value={formData.price + ".000 VNĐ"} readOnly />}
                                </Form.Item>
                                <Form.Item>
                                    <MapContainer ref={setMap} style={{ width: '475px', height: '400px' }} zoom={13} scrollWheelZoom={true}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                    </MapContainer>
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>
                    {/* <BottomFooter /> */}
                </div>
            </div>


        </>
    )
}

export default HomePage