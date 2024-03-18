// Thư viện leaflet và react-leaflet
import L from "leaflet";
import "leaflet-routing-machine";

import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';

import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { icon } from "leaflet";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

// Thư viện Bootstrap và React Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'bootstrap-icons/font/bootstrap-icons.css';

// Component React
import { React, useEffect, useState, createContext, useContext } from "react";
import { useParams } from "react-router-dom";
import { BottomTripCard, MenuNavbar, BottomMenuCard, DriverOffflineNotiCard, MapOverlay } from "../../components";


// Screen constants
import { ScreenDevices } from '../../constants';

// Socket
import { SocketTransportationContext } from "../../sockets";
import { SocketTransportationContextForRegisterTrip } from "../../sockets";
import { SocketChatingContextProvider } from "../../sockets";
import { SocketCallingContextProvider } from "../../sockets";
import { beAPI } from "../../api";

// Antd

import { PhoneOutlined, MessageOutlined, SafetyOutlined, EditOutlined, EllipsisOutlined, SettingOutlined, IdcardOutlined,
  InfoCircleOutlined, UserOutlined, FieldTimeOutlined, HistoryOutlined } from '@ant-design/icons';
import { Avatar as AvatarAntd, Card, Skeleton, Dropdown, Form, 
  Select, Button, message, Col, Divider, Drawer, List, Row, Descriptions, Badge, Tag, Steps, Input,
  Alert, Flex, Spin } from 'antd';


// AntD
import { InputNumber, Radio, TimePicker, DatePicker, Space, Tooltip } from 'antd';

//
import { handlingCurrency, handlingDateTime } from '../../utils';

const { Meta } = Card;

// Create custom marker icon
const markerIcon = icon({
  iconUrl: require("../../assets/images/marker-icon.png"),
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
});

const startingPointMarkerIcon = icon({
  iconUrl: require("../../assets/images/starting-point-marker.png"),
  iconAnchor: [24, 44], // point of the icon which will correspond to marker's location
});

const myLocationIcon = icon({
  iconUrl: require("../../assets/images/my-location-icon.png"),
  iconSize: [24, 24]
});

function RegiterTrip() {
  // Biến lấy từ context socket
  const socketTransportationContextForRegisterTrip = useContext(SocketTransportationContextForRegisterTrip);
  const { myself, updateLocation, bookRide,

    acceptRideResult, acceptRideResultReason,

    cancelRide,
    cancelRideResult,
    cancelRideResultReason
  } = socketTransportationContextForRegisterTrip;

  // Biến tọa độ hiện tại của tài xế
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [currentLongitude, setCurrentLongitude] = useState(0);

  // Biến map
  const [map, setMap] = useState(null);
  const [mapRouting, setMapRouting] = useState(null);

  // Biến customer
  const [customer, setCustomer] = useState(null);


  // Biến messageApi để dùng hiển thị kết quả thực thi
  const [messageApi, contextHolder] = message.useMessage();


  // Biến ride
  const [ride, setRide] = useState({
    uuid: null,
    fullName: null,
    gender: null,
    phone: null,
    seat: null,
    rideStartTime: null,
    rideEndTime: null,
    startingPoint: null,
    destinationPoint: null,
    distance: null,
    price: null,
    note: null
  });

  // Biến form cho tạo cuốc xe
  const [createRideForm] = Form.useForm();

  // Biến cho điểm đón
  const [addressStartingPointData, setAddressStartingPointData] = useState([]);
  const [addressStartingPointValue, setAddressStartingPointValue] = useState();

  // Biến cho điểm đến
  const [addressDestinationPointData, setAddressDestinationPointData] = useState([]);
  const [addressDestinationPointValue, setAddressDestinationPointValue] = useState();

  const [waitingForDriver, setWaitingForDriver] = useState(false);

  
  // Biến cho hàm tránh việc phải search liên tục
  let timeout;

  // Hàm gọi API tìm kiếm địa điểm đón và gán vào gợi ý input
  const handleAddressStartingPointSearch = (newValue) => {
    // Nếu input chưa đủ 5 kí tự sẽ không search
    if(newValue.length < 5)
      return;

    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    var fetchSearchNominatim = async () => {
      let listAddress = await fetch(`https://nominatim.openstreetmap.org/search.php?q=${encodeURIComponent(
        newValue
      )}&limit=5&format=jsonv2`).then(res => res.json())


      let mapListAddress = listAddress.map((item) => ({
        value: `${item.lat};${item.lon};${item.display_name}`,
        text: item.display_name,
      }));

      setAddressStartingPointData(mapListAddress);
    }

    if (newValue) {
      // Mục đích set time out để tránh mỗi khi người dùng thay đổi input lại phải gọi API dễ bị quá tải
      timeout = setTimeout(fetchSearchNominatim, 1000);
    }
  };

  // Hàm thay đổi địa điểm đón
  const handleAddressStartingPointChange = (newValue) => {
    setAddressStartingPointValue(newValue);
  };

  // Hàm gọi API tìm kiếm địa điểm đến và gán vào gợi ý input
  const handleAddressDestinationPointSearch = (newValue) => {
    // Nếu input chưa đủ 5 kí tự sẽ không search
    if(newValue.length < 5)
      return;

    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    var fetchSearchNominatim = async () => {
      let listAddress = await fetch(`https://nominatim.openstreetmap.org/search.php?q=${encodeURIComponent(
        newValue
      )}&limit=5&format=jsonv2`).then(res => res.json())


      let mapListAddress = listAddress.map((item) => ({
        value: `${item.lat};${item.lon};${item.display_name}`,
        text: item.display_name,
      }));

      setAddressDestinationPointData(mapListAddress)
    }

    if (newValue) {
      // Mục đích set time out để tránh mỗi khi người dùng thay đổi input lại phải gọi API dễ bị quá tải
      timeout = setTimeout(fetchSearchNominatim, 1000);
    }
  };

  // Hàm thay đổi địa điểm đến
  const handleAddressDestinationPointChange = (newValue) => {
    setAddressDestinationPointValue(newValue);
  };

  //Lấy tọa độ hiện tại
  const getCurrentUserPosition = async () => {
    navigator.geolocation.watchPosition(
      async position => { 
        setCurrentLatitude(position.coords.latitude);
        setCurrentLongitude(position.coords.longitude);

        console.log("location")

        updateLocation({ 
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })


        // Nếu điểm đón bị rỗng sẽ gọi API set ngay cho điểm đón là vị trí hiện tại
        if (!addressStartingPointValue){
          let currentAddressResponse = await fetch(`https://nominatim.openstreetmap.org/reverse.php?lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=12&format=jsonv2`).then(res => res.json())
          let currentAddress =`${position.coords.latitude};${position.coords.longitude};${currentAddressResponse.display_name}`
          setAddressStartingPointValue(currentAddress)
        }
      },
      err => console.log(err)
    );
  };

  
  // Hàm sử dụng route thay đổi để set quãng đường, giá tiền, thời gian
  const handleRouteChange = (e) => {
    let distanceInKm = (e.routes[0].summary.totalDistance / 1000).toFixed(2);

    /* Tính quãng đường */
    createRideForm.setFieldValue("ride-distance-input", distanceInKm);

    // Tính tiền
    // Gía tiền taxi 4 chỗ: mở cửa_10k (tính cho 0.3km đầu tiên); km tiếp theo_13.9k + km thứ 33_11k
    // Gía tiền taxi 7 chỗ: mở cửa_10k (tính cho 0.3km đầu tiên); km tiếp theo_15.9k + km thứ 33_12.8k
    // Thời gian chờ 20k/1h
    // Đặt 35km xe 4 chỗ: 10.000 + (33-0.3)*13.900 + (35-33)*11.000 = 486.530 đồng.

    /* Tính giá tiền */
    let price = 0;
    // 4 chỗ
    if (createRideForm.getFieldValue("ride-number-seat") <= 4){
      if( distanceInKm <= 33){
        price = 10000 + (distanceInKm - 0.3)*13900;
      }
      else {
        price = 10000 + (distanceInKm - 0.3)*13900 + (distanceInKm-33)*11000;
      }
    }
    // 7 chỗ
    else{
      if( distanceInKm <= 33){
        price = 10000 + (distanceInKm - 0.3)*15900;
      }
      else {
        price = 10000 + (distanceInKm - 0.3)*15900 + (distanceInKm-33)*12800;
      }
    }
    
    /* Set giá chuyến đi */
    createRideForm.setFieldValue("ride-price-input", handlingCurrency.convertFloatNumberToVNDFormat(price));

    /* Set thời gian */
    createRideForm.setFieldValue("ride-time-input", handlingDateTime.convertSecondToHMSTimeFormat(e.routes[0].summary.totalTime) );
  }

  // Hàm submit
  const submitCreateRideForm = async () => {
    let ride = {
      fullName: createRideForm.getFieldValue("customer-name-input") == null ? localStorage.getItem("fullName") : createRideForm.getFieldValue("customer-name-input"),
      gender: createRideForm.getFieldValue("customer-gender") == null ? "male" : createRideForm.getFieldValue("customer-gender"),
      phone: createRideForm.getFieldValue("customer-phone-input"),
      seat: createRideForm.getFieldValue("ride-number-seat") == null ? 1 : createRideForm.getFieldValue("ride-number-seat"),
      startingPoint: addressStartingPointValue,
      destinationPoint: addressDestinationPointValue,
      distance: parseFloat( createRideForm.getFieldValue("ride-distance-input") == null ? 0 : createRideForm.getFieldValue("ride-distance-input") ),
      price: parseInt( createRideForm.getFieldValue("ride-price-input") == null ? 0 : createRideForm.getFieldValue("ride-price-input").replace(/[.₫]/g, '').trim() ),
      note: createRideForm.getFieldValue("customer-note-input")
    }
    

    // Gọi API để tạo cuốc
    let responseCreateRideData = await beAPI.post('/ride', ride);
    // Không thể tạo cuốc
    if ( responseCreateRideData.status != 201 ){
      messageApi.open({
        type: 'error',
        content: 'Không thể tạo cuốc đi mới',
      });
      return;
    }


    let ridestatus = {
      rideId: responseCreateRideData.data.data.uuid,
      state: "CREATED"
    }

    // Gọi API để tạo Ridestatus
    let responseCreateRidestatusData = await beAPI.post('/ridestatus', ridestatus);
    // Không thể tạo cuốc
    if ( responseCreateRidestatusData.status != 201 ){
      messageApi.open({
        type: 'error',
        content: 'Không thể tạo cuốc đi mới',
      });
      return;
    }

    // gửi uuid ride cho bookRide
    bookRide( responseCreateRideData.data.data.uuid );

    setRide( responseCreateRideData.data.data );
    
    setWaitingForDriver(true);
  }



  useEffect(() => {
    // if ( addressStartingPoint == null && addressDestinationPoint == null ) {
    //   getRideInformation();
    // }

    if( currentLatitude == 0 && currentLongitude == 0){
      getCurrentUserPosition();
    }

    if(map){
      
      // Set view
      map.setView([currentLatitude, currentLongitude], 15);

      //Routing
      if(addressStartingPointValue && addressDestinationPointValue && waitingForDriver == false){
        //Nếu routing trống
        if(!mapRouting){
          var routingMachine = L.Routing.control({
            waypoints: [
              L.latLng(addressStartingPointValue.split(";")[0], addressStartingPointValue.split(";")[1]),
              L.latLng(addressDestinationPointValue.split(";")[0], addressDestinationPointValue.split(";")[1])
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
                draggable: true,
              });
    
              return marker;
            },
    
            //addWaypoints: true,
            routeWhileDragging: true,
            //draggableWaypoints: true,
            //fitSelectedRoutes: true,
            //showAlternatives: false,
            containerClassName: 'd-none',
            collapsible: true,
            show: false,
            
          });
          
          setMapRouting(routingMachine);
          map.addControl(routingMachine);

          routingMachine.on('routesfound', (e) => {
            handleRouteChange(e);
          });
        }
        //Nếu đã có routing thì chỉ cần set waypoint
        else{
          mapRouting.setWaypoints([
            L.latLng(addressStartingPointValue.split(";")[0], addressStartingPointValue.split(";")[1]),
            L.latLng(addressDestinationPointValue.split(";")[0], addressDestinationPointValue.split(";")[1])
          ])
          //map.addControl(mapRouting);
        }
      }

    }

    // Bắt và thực thi sự kiên acceptRideResult
    if( ride.uuid != null && acceptRideResult == true ){
      messageApi.open({
        type: 'success',
        content: 'Đã có tài xế nhận cuốc chuyển trang trong 2s',
      });

      // Chờ 3s để điều hướng
      setTimeout(() => {
        // Điều hướng đến trang chi tiết chuyến đi
        window.location.href = `/trip/${ride.uuid}`;

      }, 3000);
    }

    return () => {}

  }, [map, mapRouting, currentLatitude, acceptRideResult, addressDestinationPointValue]);

  return (
    <>
      {contextHolder}
      <div className="Trip d-flex flex-column" style={{height: '100vh'}}>

        {/* <MenuNavbar />  bỏ đi vì khá chật*/}

        {/* {<TripMap className="flex-grow: 1"/>} */}

        <MapContainer className="flex-grow: 1" 
          center={[currentLatitude, currentLongitude]} zoom={15} minZoom={8} maxZoom={18} 
          scrollWheelZoom={true}
          style={{position: 'relative', width:'100%', height: '100%'}} ref={setMap}>
        
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker 
            position={[currentLatitude, currentLongitude]}
            icon={
              myLocationIcon
            }
          >
            <Popup>
              Vị trí hiện tại<br />  của bạn ở đây.
            </Popup>
          </Marker>

        </MapContainer>

        {waitingForDriver==true && 
          <Card 
            size="small"
            title="Vui lòng chờ tài xế nhận cuốc"
            extra={
              <Button type="primary" size="small" onClick={() => cancelRide(ride.uuid)}>Hủy đặt cuốc</Button>
            }
          >
            <Flex gap="small" vertical>

            <Spin tip="Đang tìm tài xế cho bạn" size="large" className="mt-5"></Spin>
              <div className="text-center">Đang tìm tài xế cho bạn</div>
            </Flex>
          </Card>
        }
          
        {waitingForDriver==false && 
          <Card 
            size="small"
            title="Bạn muốn đi đâu"
            extra={
              <>

                <Space size="middle">
                  <Button icon={<i class="bi bi-house"></i>} type="default" size="small" href="/">
                    Trang chủ
                  </Button>

                  <Button icon={<i class="bi bi-upload"></i>} type="primary" size="small" data-bs-toggle="offcanvas" 
                  data-bs-target="#registerDetailTripOffcanvasRight" aria-controls="registerDetailTripOffcanvasRight"
                  >
                    Đăng ký
                  </Button>
                </Space>
                
              </>
            }
          >
            <Skeleton loading={false} avatar active>

              <Form>

                <Steps
                  className="mt-3"
                  direction="vertical"
                  items={[
                    {
                      title: 'Đón tôi tại',
                      status: "finish",
                      icon: <i className="bi bi-geo-fill" style={{color: "#ff4d4f"}}></i>,
                      description: 
                      <Row>
                        <Col span={24}>
                          <Form.Item name="ride-address-starting-point-input">
                            <Select
                              showSearch
                              value={addressStartingPointValue}
                              defaultActiveFirstOption={false}
                              suffixIcon={null}
                              filterOption={false}
                              onSearch={handleAddressStartingPointSearch}
                              onChange={handleAddressStartingPointChange}
                              notFoundContent={null}
                              options={(addressStartingPointData || []).map((d) => ({
                                value: d.value,
                                label: d.text,
                              }))}
                              defaultValue={"Vị trí của tôi"}
                              placeholder="Số đường quận..."/>
                          </Form.Item>
                        </Col>
                      </Row>
                    },
                    {
                      title: 'Đưa tôi đến',
                      status: 'finish',
                      icon: <i className="bi bi-geo-alt-fill" ></i>,
                      description: 
                      <Row>
                        <Col span={24}>
                          <Form.Item name="ride-address-destination-point-input">

                            <Select
                              showSearch
                              value={addressDestinationPointValue}
                              defaultActiveFirstOption={false}
                              suffixIcon={null}
                              filterOption={false}
                              onSearch={handleAddressDestinationPointSearch}
                              onChange={handleAddressDestinationPointChange}
                              notFoundContent={null}
                              options={(addressDestinationPointData || []).map((d) => ({
                                value: d.value,
                                label: d.text,
                              }))}

                              placeholder="Số đường quận..."/>

                          </Form.Item>
                        </Col>
                      </Row>
                    },
                  ]}
                />
              </Form>

              {/* Detail canvas */}
              <div class="offcanvas offcanvas-bottom" style={{height: "690px"}} tabIndex="-1" id="registerDetailTripOffcanvasRight" aria-labelledby="registerDetailTripRightLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="registerDetailTripRightLabel">Điền thông tin cuốc đi</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">

                  <Form layout="vertical" form={createRideForm}>

                    <Row gutter={16}>

                      <Col span={16}>
                        <Form.Item name="customer-name-input" label="Tên người đặt cuốc">
                          <Input placeholder="Nguyễn Văn A..." defaultValue={localStorage.getItem("fullName")}/>
                        </Form.Item>
                      </Col>
                      
                      <Col span={8}>
                        <Form.Item name="customer-phone-input" label="Số điện thoại" initialValue={localStorage.getItem("phone")}>
                          <Input placeholder="09684729xx..." />
                        </Form.Item>
                      </Col>

                    </Row>

                    <Row gutter={16}>

                      <Col span={8}>
                        <Form.Item name="ride-number-seat" label="Số ghế">
                          <InputNumber defaultValue={1} max={7} min={1} style={{width: "100%"}}/>
                        </Form.Item>
                      </Col>

                      <Col span={16}>
                        <Form.Item name="customer-gender" label="Giới tính">
                          <Select defaultValue={localStorage.getItem("gender") == "male" ? "male" : "female"}>
                            <Select.Option value="male">Nam</Select.Option>
                            <Select.Option value="female">Nữ</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>

                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="ride-distance-input" label="Khoảng cách">
                          <Input
                            placeholder="Vui lòng chọn quãng đường..."
                            suffix="KM"
                            prefix={
                              <Tooltip title="Tạm tính">
                                <InfoCircleOutlined
                                  style={{
                                    color: 'rgba(0,0,0,.45)',
                                  }}
                                />
                              </Tooltip>
                            }
                            disabled
                          />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item name="ride-time-input" label="Tổng thời gian">
                          <Input
                            placeholder="Vui lòng chọn quãng đường..."
                            suffix={ <HistoryOutlined className="site-form-item-icon" /> }
                            prefix={
                              <Tooltip title="Thời gian chuyến đi">
                                <InfoCircleOutlined
                                  style={{
                                    color: 'rgba(0,0,0,.45)',
                                  }}
                                />
                              </Tooltip>
                            }
                            disabled
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={24}>
                        <Form.Item name="ride-price-input" label="Tổng tiền">
                          <Input
                            placeholder="Vui lòng chọn quãng đường..."
                            suffix="VNĐ"
                            prefix={
                              <Tooltip title="Tạm tính">
                                <InfoCircleOutlined
                                  style={{
                                    color: 'rgba(0,0,0,.45)',
                                  }}
                                />
                              </Tooltip>
                            }
                            disabled
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={24}>
                        <Form.Item name="customer-note-input" label="Ghi chú của bạn">
                          <Input.TextArea rows={3} placeholder="Trống..." showCount maxLength={200} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row>
                      <Form.Item>
                        <Space>
                          <Button type="primary" htmlType="submit" onClick={submitCreateRideForm}>
                            Tạo cuốc
                          </Button>
                          <Button htmlType="reset">
                            Làm lại
                          </Button>
                        </Space>
                      </Form.Item>
                    </Row>

                  </Form>

                </div>
              </div>

            </Skeleton>
          </Card>
        }
        
        
        

      </div>
    </>
  );
}

export default RegiterTrip;