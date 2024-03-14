import React, {useEffect, useState} from "react";

//
import L from "leaflet";
import "leaflet-routing-machine";
//

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';

import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';


import { icon } from "leaflet";


function TripMap(){
  //Biến tọa độ hiện tại của tài xế
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [currentLongitude, setCurrentLongitude] = useState(0);

  //Biến tọa độ biến điểm đến

  //Biến map
  const [map, setMap] = useState(null);

   //create custom marker icon
   const markerIcon = icon({
    iconUrl: require("../../assets/images/marker-icon.png")
  })
  
  //Lấy tọa độ hiện tại và refresh lại view
  async function getCurrentUserPosition(){
    await navigator.geolocation.getCurrentPosition(
      position => { 
        setCurrentLatitude(position.coords.latitude);
        setCurrentLongitude(position.coords.longitude);
        
        //https://github.com/perliedman/leaflet-routing-machine/issues/20 (fixed)
      },
      err => console.log(err)
    );
  };

  getCurrentUserPosition();

  //https://codesandbox.io/s/rlv3-routing-machine-gzdt1?file=/src/RoutineMachine.js:692-706

  useEffect( () => {

    if(map){

      // Set view
      map.setView([currentLatitude, currentLongitude], 15);

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
      
      // Cho phép zoom bằng scroll
      map.scrollWheelZoom.enable();

      // Routing
      L.Routing.control({
        waypoints: [
          //10.729753960741485, 106.69989835053133
          L.latLng(10.732837533753461, 106.7001987568147), // Đại học TĐT
          L.latLng(10.741130424922074, 106.70173269288999), // Lotte
        ],
        lineOptions: {
          styles: [{ color: "#6FA1EC", weight: 4 }]
        },

        createMarker: function (i, start, n){
          var marker_icon = null
          if (i == 0) {
            // This is the first marker, indicating start
            marker_icon = markerIcon;
          } else if (i == n -1) {
            //This is the last marker indicating destination
            marker_icon = markerIcon;
          }
          var marker = L.marker(start.latLng, {
            icon: marker_icon
          })

          return marker
        },

        
        addWaypoints: true,
        routeWhileDragging: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,

        collapsible: true,
        show: false,

      }).addTo(map);
      

    }

    return () => {
      
    }

  }, [currentLatitude, currentLongitude]);
 

  return(
    <MapContainer  center={[currentLatitude, currentLongitude]} zoom={15} minZoom={8} maxZoom={18} scrollWheelZoom={false} style={{position: 'relative', width:'100%', height: '100%'}} ref={setMap}>
      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <Marker 
        position={[currentLatitude, currentLongitude]}
        icon={
          markerIcon
        }
      >
        <Popup>
          Vị trí hiện tại<br />  của bạn ở đây.
        </Popup>
      </Marker>

    </MapContainer>
  );
}

export default TripMap;