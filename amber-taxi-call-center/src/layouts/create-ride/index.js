// Leaflet
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
//import 'leaflet/dist/leaflet.js'; không được import cái này
import { icon } from "leaflet";

import "leaflet-routing-machine";
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import { MapContainer, TileLayer, useMap, Marker, FeatureGroup, Popup } from 'react-leaflet'

// React components
import { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

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

// Images
import wavesWhite from "assets/images/shapes/waves-white.svg";
import rocketWhite from "assets/images/illustrations/rocket-white.png";

// AntD
import { Button, Form, Input, InputNumber, Select, Radio, message, TimePicker, Row, Col, DatePicker, Space, Tooltip } from 'antd';
import { InfoCircleOutlined, UserOutlined, FieldTimeOutlined, HistoryOutlined } from '@ant-design/icons';

// Boostrap icon 5
import 'bootstrap-icons/font/bootstrap-icons.css';

// Be API
import { beAPI } from 'api';

/*
Điều phối viên taxi là người có nhiệm vụ nhận và xử lý các cuộc gọi của khách hàng 
đặt xe taxi, phân bổ và phân công các tài xế cho các đơn hàng, theo dõi và giám sát 
tình hình hoạt động của các xe taxi, xử lý các sự cố và khiếu nại liên quan đến 
dịch vụ taxi. Điều phối viên taxi cần có kỹ năng giao tiếp, quản lý thời gian, 
xử lý tình huống, sử dụng máy tính và các phần mềm hỗ trợ. Điều phối viên taxi 
thường làm việc trong các trung tâm điều hành của các công ty taxi hoặc các 
ứng dụng đặt xe trực tuyến.

https://www.geeksforgeeks.org/how-to-create-button-to-open-sms-compose-to-a-phone-number-using-html/

Trong đây chứng minh có đoạn profile	String	driving	The OSRM profile to use in requests
https://www.liedman.net/leaflet-routing-machine/api/#l-routing-plan

*/


// Create custom marker icon
const markerIcon = icon({
  iconUrl: require("../../assets/images/marker-icon.png"),
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
});

const startingPointMarkerIcon = icon({
  iconUrl: require("../../assets/images/starting-point-marker.png"),
  iconAnchor: [24, 44], // point of the icon which will correspond to marker's location
});

function CreateRide() {

  // Map variable
  const [map, setMap] = useState(null);
  const [mapRouting, setMapRouting] = useState(null);

  // Biến latitude và longitude mặc định
  const [latitude, setLatitude] = useState(11.142451414209289); //latitude of Saigon River
  const [longitude, setLongitude] = useState(106.50830205050272); //longitude of Saigon River

  // Biến cho điểm đón
  const [addressStartingPointData, setAddressStartingPointData] = useState([]);
  const [addressStartingPointValue, setAddressStartingPointValue] = useState();

  // Biến cho điểm đến
  const [addressDestinationPointData, setAddressDestinationPointData] = useState([]);
  const [addressDestinationPointValue, setAddressDestinationPointValue] = useState();

  // Biếu form dùng cho lấy dữ liệu từ form
  const [createRideForm] = Form.useForm();
  // createRideForm.setFieldsValue({
  //   "customer-gender": "male",
  //   "customer-name-input": null,
  //   "customer-note-input": null,
  //   "customer-phone-input": null,
  //   "ride-address-destination-point-input": null,
  //   "ride-address-starting-point-input": null,
  //   "ride-distance-input": null,
  //   "ride-number-seat": 1,
  //   "ride-start-datetime": null,
  //   "ride-price-input": 0,
  //   "ride-distance-input": 0
  // });

  // Biến summary của route
  const [routeSummary, setRouteSummary] = useState(null);

  // Biến messageApi để dùng hiển thị kết quả thực thi
  const [messageApi, contextHolder] = message.useMessage();


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

  // Hàm submit
  const submitCreateRideForm = async () => {
    //console.log(createRideForm.getFieldsValue())
    // Có một bug form của select gender, input seat khi chưa chọn sẽ bị mặc định là null mặc dù đã có defaultValue
    /*
    {
      "customer-name-input": "Thắng",
      "customer-phone-input": "Lưu",
      "ride-start-datetime": "2024-03-08T14:52:29.300Z",
      "ride-number-seat": 2,
      "customer-gender": "male",
      "ride-address-starting-point-input": "10.7375481;106.7302238;Quận 7, Thành phố Hồ Chí Minh, Việt Nam",
      "ride-address-destination-point-input": "10.7217236;106.6296151;Quận 8, Thành phố Hồ Chí Minh, Việt Nam",
      "ride-distance-input": "14.89",
      "ride-price-input": "241.981 ₫",
      "ride-time-input": "0:18:50",
      "customer-note-input": "Hahah"
    }
    */

    let ride = {
      fullName: createRideForm.getFieldValue("customer-name-input"),
      gender: createRideForm.getFieldValue("customer-gender") == null ? "male" : createRideForm.getFieldValue("customer-gender"),
      phone: createRideForm.getFieldValue("customer-phone-input"),
      seat: createRideForm.getFieldValue("ride-number-seat") == null ? 1 : createRideForm.getFieldValue("ride-number-seat"),
      rideStartTime: createRideForm.getFieldValue("ride-start-datetime"),
      rideEndTime: null,
      startingPoint: createRideForm.getFieldValue("ride-address-starting-point-input"),
      destinationPoint: createRideForm.getFieldValue("ride-address-destination-point-input"),
      distance: parseFloat( createRideForm.getFieldValue("ride-distance-input") == null ? 0 : createRideForm.getFieldValue("ride-distance-input") ),
      price: parseInt( createRideForm.getFieldValue("ride-price-input") == null ? 0 : createRideForm.getFieldValue("ride-price-input").replace(/[.₫]/g, '').trim() ),
      note: createRideForm.getFieldValue("customer-note-input")
    }


  //   CREATE TABLE `RideStatus`(
  //     `uuid`                          VARCHAR(256)    NOT NULL PRIMARY KEY DEFAULT UUID(),
  //     `driverId`                      VARCHAR(256)    ,
  //     `driverShiftId`                 VARCHAR(256)    ,
  //     `state`                         VARCHAR(12)     NOT NULL DEFAULT 'CREATED',
  //     `stateTime`                     DATETIME        NOT NULL,
  //     `stateDetail`                   VARCHAR(256)    ,
  //     FOREIGN KEY (`driverId`)        REFERENCES      `User`(`uuid`) ON DELETE CASCADE,
  //     FOREIGN KEY (`driverShiftId`)   REFERENCES      `DriverShift`(`uuid`) ON DELETE CASCADE
  // );

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

    // Tất cả API đều thực thi thành công
    messageApi.open({
      type: 'success',
      content: 'Tạo cuốc đi thành công, chuyển trang trong 2s',
    });

    // Chờ 2s để điều hướng
    setTimeout(() => {
        
      // Điều hướng đến trang chi tiết chuyến đi
      window.location.href = `/ride-detail/${responseCreateRideData.data.data.uuid}`;

    }, 2000);

  }

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
    
    createRideForm.setFieldValue("ride-price-input", new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price) );

    /* Tính thời gian */
    let totalSeconds = e.routes[0].summary.totalTime;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    createRideForm.setFieldValue("ride-time-input", `${hours.toFixed(0)}:${minutes.toFixed(0)}:${seconds.toFixed(0)}`);
  }

  
  useEffect( () => {
    // Set view of map to latitude, longitude
    if(map){
      map.setView([latitude, longitude], 12);

      //Routing
      if(addressStartingPointValue && addressDestinationPointValue){
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

      return () => {}
    }

  }, [map, addressStartingPointValue, addressDestinationPointValue]);

  return (

    <>
      {contextHolder}

      <DashboardLayout>
          <DashboardNavbar />
          
          <SoftBox mb={3}>

            <Grid container spacing={3}>

              <Grid item xs={12} lg={7}>
                <Card>

                  <SoftBox p={2}>

                    <h3>Nhập thông tin cuốc</h3>

                    <Form layout="vertical" form={createRideForm}>

                      <Row gutter={16}>

                        <Col span={16}>
                          <Form.Item name="customer-name-input" label="Tên khách hàng">
                            <Input placeholder="Nguyễn Văn A..." />
                          </Form.Item>
                        </Col>
                        
                        <Col span={8}>
                          <Form.Item name="customer-phone-input" label="Số điện thoại">
                            <Input placeholder="09684729xx..." />
                          </Form.Item>
                        </Col>

                      </Row>

                      <Row gutter={16}>

                        <Col span={6}>
                          <Form.Item name="ride-start-datetime" label="Ngày đặt cuốc">
                            <DatePicker style={{width: "100%"}} />
                          </Form.Item>
                        </Col>

                        <Col span={6}>
                          <Form.Item label="Thời gian đặt">
                            <TimePicker style={{width: "100%"}} />
                          </Form.Item>
                        </Col>

                        <Col span={4}>
                          <Form.Item name="ride-number-seat" label="Số ghế">
                            <InputNumber defaultValue={1} max={7} min={1} style={{width: "100%"}}/>
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item name="customer-gender" label="Giới tính">
                            <Select defaultValue="male">
                              <Select.Option value="male">Nam</Select.Option>
                              <Select.Option value="female">Nữ</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>

                      </Row>

                      <Row>

                        <Col span={24}>
                          <Form.Item name="ride-address-starting-point-input" label="Điểm đón">

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

                              placeholder="Số đường quận..."/>

                          </Form.Item>
                        </Col>
                      </Row>

                      <Row>
                        <Col span={24}>
                          <Form.Item name="ride-address-destination-point-input" label="Điểm đến">

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

                      <Row gutter={16}>
                        <Col span={8}>
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
                            />
                          </Form.Item>
                        </Col>

                        <Col span={8}>
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
                            />
                          </Form.Item>
                        </Col>

                        <Col span={8}>
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
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row>
                        <Col span={24}>
                          <Form.Item name="customer-note-input" label="Ghi chú của khách hàng">
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
                            <Button htmlType="button">
                              Làm lại
                            </Button>
                          </Space>
                        </Form.Item>
                      </Row>

                    </Form>

                  </SoftBox>
                  
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
    </>

  );
}

export default CreateRide;
