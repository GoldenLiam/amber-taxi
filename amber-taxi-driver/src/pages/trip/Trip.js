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

import { Button, Modal, Form, FormCheck } from "react-bootstrap";

// Component React
import { React, useEffect, useState, createContext, useContext } from "react";
import { useParams } from "react-router-dom";
import { BottomTripCard, MenuNavbar, BottomMenuCard, DriverOffflineNotiCard, MapOverlay } from "../../components";


// Screen constants
import { ScreenDevices } from '../../constants';

// Socket
import { SocketTransportationContext } from "../../sockets";
import { SocketChatingContextProvider } from "../../sockets";
import { SocketCallingContextProvider } from "../../sockets";
import { beAPI } from "../../api";

// Antd
import { message } from "antd";


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

function Trip() {
  // Biến lấy từ context socket
  const socketTransportationContext = useContext(SocketTransportationContext);
  const { myself, updateLocation, updateRideList, rideList, 
    acceptRide, acceptRideResult, acceptRideResultReason, 

    pickRide,
    pickRideResult,
    pickRideResultReason,

    denyRide,
    denyRideResult,
    denyRideResultReason,

    completeRide,
    completeRideResult,
    completeRideResultReason } = socketTransportationContext;

  // Biến tọa độ hiện tại của tài xế
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [currentLongitude, setCurrentLongitude] = useState(0);

  // Biến cho điểm đón
  const [addressStartingPoint, setAddressStartingPoint] = useState(null);

  // Biến cho điểm đến
  const [addressDestinationPoint, setAddressDestinationPoint] = useState(null);

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

  // Biến ridestatus
  const [ridestatus, setRideStatus] = useState({
    uuid: null,
    rideId: null,
    driverId: null,
    driverShiftId: null,
    state: null,
    stateTime: null,
    stateDetail: null
  });

  // Biến uuid của ride lấy từ params
  let { uuid } = useParams();

  // Hàm để lấy ride bằng uuid
  const getRideInformation = async () => {
    // Lấy dữ liệu ride bằng uuid
    let responseRideData = await beAPI.get(`/ride/${uuid}`);

    if (responseRideData.status == 200){
      
      // Kiểm tra xem ride này có hợp lệ không
      if(responseRideData.data.data == undefined){
        window.location.href = "/";
      }

      if( JSON.stringify(responseRideData.data.data.startingPoint) && JSON.stringify(addressStartingPoint) ){
        setAddressStartingPoint(responseRideData.data.data.startingPoint);
      }
  
      if( JSON.stringify(responseRideData.data.data.destinationPoint) && JSON.stringify(addressDestinationPoint) ){
        setAddressDestinationPoint(responseRideData.data.data.destinationPoint);
      }

      if( JSON.stringify(responseRideData.data.data) && JSON.stringify(ride) ){
        setRide(responseRideData.data.data);
      }

      // Lấy dữ liệu user
      let responseUserData = await beAPI.get(`/user/getUserByPhone/${responseRideData.data.data.phone}`);

      if(responseUserData.status == 200){
        // set customer
        if( JSON.stringify(responseUserData.data.data) && JSON.stringify(customer) ){
          setCustomer(responseUserData.data.data);
        }
      }

      // Lấy dữ liệu ridestatus
      let responseRidestatusData = await beAPI.get(`/ridestatus/rideId/${uuid}`);

      if(responseRidestatusData.status == 200){
        // set ridestatus
        if( JSON.stringify(responseRidestatusData.data.data) && JSON.stringify(ridestatus) ){
          setRideStatus(responseRidestatusData.data.data);
        }
      }
    }

    console.log("dasdas");
  }

  const getRidestatus = async () => {
    // Lấy dữ liệu ridestatus
    let responseRidestatusData = await beAPI.get(`/ridestatus/rideId/${uuid}`);

    if(responseRidestatusData.status == 200){
      // set ridestatus
      if( JSON.stringify(responseRidestatusData.data.data) && JSON.stringify(ridestatus) ){
        setRideStatus(responseRidestatusData.data.data);
      }
    }
  }


  //Lấy tọa độ hiện tại
  const getCurrentUserPosition = async () => {
    navigator.geolocation.watchPosition(
      position => { 
        setCurrentLatitude(position.coords.latitude);
        setCurrentLongitude(position.coords.longitude);

        console.log("location")

        updateLocation({ 
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })

      },
      err => console.log(err)
    );
  };


  useEffect(() => {
    // Kiểm tra xem tài xế này có hợp lệ vào cuốc xe này không
    if ( ridestatus.driverId != null && ridestatus.driverId != localStorage.getItem("uuid") ){
      window.location.href = "/";
    }

    if ( addressStartingPoint == null && addressDestinationPoint == null ) {
      getRideInformation();
    }

    if( currentLatitude == 0 && currentLongitude == 0){
      getCurrentUserPosition();
    }


    if(map){
      
      // Set view
      map.setView([currentLatitude, currentLongitude], 15);

      // Nếu đã có routing không cần load nữa
      if(!mapRouting && addressStartingPoint!=null && addressDestinationPoint!=null){
        // Tạo button center vị trí người dùng
        let buttonCenterCurrentLocationExtend = L.Control.extend({
          onAdd: (map) => {
            let findMyLocationButton = L.DomUtil.create("button", "btn btn-outline-light rounded");
            findMyLocationButton.style.boxShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px";


            let divIconButton = L.DomUtil.create("div", "");

            divIconButton.style.backgroundImage = `url('https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png')`;
            divIconButton.style.width = "18px";
            divIconButton.style.height = "18px";
            divIconButton.style.backgroundPositionX = "18px";
            divIconButton.style.backgroundPositionY = "0px";

            findMyLocationButton.appendChild(divIconButton)
            
    
            findMyLocationButton.addEventListener("click", () => {
              // var marker = L.marker()
              //   .setLatLng( new L.LatLng(currentLatitude, currentLongitude) )
              //   .bindPopup("Bạn đang ở đây")
              //   .addTo(map);
    
              // marker.setIcon(markerIcon);
              // marker.openPopup();

              map.setView([currentLatitude, currentLongitude], 15);

            });
    
            //a bit clueless how to add a click event listener to this button and then
            // open a popup div on the map
            return findMyLocationButton;
          }
        });

        // add button này vào map
        new buttonCenterCurrentLocationExtend({position: "bottomright"}).addTo(map);
        

        // Routing
        /*
        L.latLng(10.732837533753461, 106.7001987568147), // Đại học TĐT
        L.latLng(10.839884612945609, 106.83450419902515), // Lotte
        */
        var routingMachine = L.Routing.control({
          waypoints: [
            L.latLng(addressStartingPoint.split(";")[0], addressStartingPoint.split(";")[1]), // Đại học TĐT
            L.latLng(addressDestinationPoint.split(";")[0], addressDestinationPoint.split(";")[1]), // Lotte
          ],
          lineOptions: {
            styles: [{ color: "#6FA1EC", weight: 4 }]
          },
          altLineOptions: {
            styles: [
              {color: 'white', opacity: 0.8, weight: 6},
              {color: 'blue', opacity: 0.5, weight: 2}
            ]
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
              draggable: false
            });

            return marker;
          },

          addWaypoints: false,
          routeWhileDragging: false,
          draggableWaypoints: false,
          fitSelectedRoutes: false,
          showAlternatives: true,

          collapsible: true,
          show: false,
        });
        
        setMapRouting(routingMachine);
        map.addControl(routingMachine);
      }

    }

    if(pickRideResult == true && ridestatus.state != "PICKED"){
      getRidestatus();
    }


    return () => {}

  }, [map, mapRouting, currentLatitude, pickRideResult]);

  return (
    <>
      {contextHolder}
      <div className="Trip d-flex flex-column" style={{height: '100vh'}}>

        <MenuNavbar />

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
          
        {/* Chat context cho bottom trip card */}
        
        <SocketCallingContextProvider>
          <SocketChatingContextProvider>

            <BottomTripCard data={{
              ride, customer, uuid, ridestatus,

              pickRide,
              pickRideResult,
              pickRideResultReason,

              denyRide,
              denyRideResult,
              denyRideResultReason,

              completeRide,
              completeRideResult,
              completeRideResultReason }}/>
          
          </SocketChatingContextProvider>
        </SocketCallingContextProvider>

        
        {/* <MapOverlay /> */}

        {/* Hiển thị trên thiết bị điện thoại */}

        {/* (ScreenDevices().isMobileDevice) && driverStatesSelector.currentState === 'offline' && 
          <DriverOffflineNotiCard driverStatesSelector />
        */}

        {/* Hiển thị bên thiết bị khác */}
        {/* (ScreenDevices().isLaptop || ScreenDevices().isDesktop || ScreenDevices().isBigScreen) && 
          <>
            <Modal aria-labelledby="contained-modal-title-vcenter" centered show={false}>
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter"><span>Lưu ý</span></Modal.Title>
              </Modal.Header>
              
              <Modal.Body>
                <p>
                  Bạn đang <b className="text-danger">offline</b> lưu ý khi <b className="text-danger">offline</b> bạn sẽ không thể 
                  tùy chọn hoặc nhận các cuốc xe tự động !
                </p>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary">
                  Tiếp tục offline
                </Button>

                <Button variant="primary">
                  Online ngay
                </Button>
                
              </Modal.Footer>
            </Modal>
          </>
        */
        }


      </div>
    </>
  );
}

export default Trip;