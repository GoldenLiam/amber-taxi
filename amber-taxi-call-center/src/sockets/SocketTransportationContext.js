import React, { createContext, useState, useRef, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { io } from 'socket.io-client';
import { beAPI } from 'api';

// Khởi tạo context
const SocketTransportationContext = createContext();

// Khởi tạo socket
const socket = io('http://localhost:5010', {
    autoConnect: false
});



const SocketTransportationContextProvider = ( childrenComponent ) => {
    const [driverNearbyList, setDriverNearbyList] = useState([]);
    const [ride, setRide] = useState(null);
    const [ridestatus, setRidestatus] = useState(null);
    const [ridestatusList, setRidestatusList] = useState([]);
    const [driverRide, setDriverRide] = useState(null);
    const [ratingRide, setRatingRide] = useState(null);

    // Gọi API để gán định danh
    var myself = {
        uuid: localStorage.getItem("uuid"),
        uuid_ride: "",
        role: "CallAgent",
        display_name: localStorage.getItem("fullName"),
        display_car_model: "",
        current_location: ""
    };

    // Biến uuid của ride lấy từ params
    let { uuid } = useParams();


    // Gọi để lấy ride và ride status (phải bao function ngoài vì nó là async)
    const getRideWithStatus = async () => {
        let responseRideData = await beAPI.get(`/ride/${uuid}`);

        // ride
        if( JSON.stringify(responseRideData.data.data) != JSON.stringify(ride) ){
            setRide(responseRideData.data.data);
        }

        // ridestatus
        let responseRidestatusData = await beAPI.get(`/ridestatus/rideId/${uuid}`);
        if( JSON.stringify(responseRidestatusData.data.data) != JSON.stringify(ridestatus) ){
            setRidestatus(responseRidestatusData.data.data);
        }

        // ridestatusList
        let responseRidestatusListData = await beAPI.get(`/ridestatus/getAllByRideId/${uuid}`);
        if( JSON.stringify(responseRidestatusListData.data.data) != JSON.stringify(ridestatusList) ){
            setRidestatusList(responseRidestatusListData.data.data);
        }


        // driverRide
        if (ridestatus){
            if( ridestatus.driverId ){
                let responseDriverRideData = await beAPI.get(`/driver/userId/${ridestatus.driverId}`);
                if( JSON.stringify(responseDriverRideData.data.data) != JSON.stringify(driverRide) ){
                    setDriverRide(responseDriverRideData.data.data);
                }

                // Nếu đã xong thì lấy dữ liệu đánh giá
                if( ridestatus.state == "DONE" ){
                    let responseRatingRideData = await beAPI.get(`/rating/getByRideId/${ridestatus.rideId}`);
                    if( JSON.stringify(responseRatingRideData.data.data) != JSON.stringify(ratingRide) ){
                        setRatingRide(responseRatingRideData.data.data);
                    }
                }
            }
        }

    }



    useEffect(() => {

        getRideWithStatus();

        //Mở kết nối socket
        socket.connect();


        //Định danh trước khi tham gia
        socket.emit('registerBeforeHandlingRide', {
            uuid: myself.uuid, 
            uuid_ride: myself.uuid_ride,
            role: myself.role,
            display_name: myself.display_name,
            display_car_model: myself.display_car_model,
            current_location: myself.current_location,
            phone: localStorage.getItem("phone")
        });

        socket.emit('bookRide', uuid);

        socket.on("driverSendLocation", ( socketUser ) => {
            // driverNearbyList.push(
            //     {
            //         key: 1,
            //         uuid: ``,
            //         name: `Lưu Quang Thắng`,
            //         carModel: `YARIS 1.5G CVT - 4 chỗ`,
            //         distance: `1.0 km`
            //     }
            // )
        })

        // Tài xế đã nhận cuốc
        socket.on("acceptSuccess", (ride_uuid) => {
            getRideWithStatus();
        })

        socket.on("cancelSuccess", (ride_uuid) => {
            getRideWithStatus();
        });

        socket.on("denySuccess", (ride_uuid) => {
            getRideWithStatus();
        });

        socket.on("completeSuccess", (ride_uuid) => {
            getRideWithStatus();
        });

        socket.on("pickSuccess", (ride_uuid) => {
            getRideWithStatus();
        });

        socket.on("getNearbyDriver", (socketDriverDistanceList) => {
            let socketDriverDistanceKeyList = [];
    
            socketDriverDistanceList.forEach(element => {
                socketDriverDistanceKeyList.push({
                    key: element.uuid,
                    uuid: element.uuid,
                    name: element.display_name,
                    carModel: element.display_car_model,
                    currentLocation: element.current_location,
                    distance: `${element.distance.toFixed(3)} km`
                });
            });
            
            // Chắc chắn là phải khác nhau mới set lại list
            if( JSON.stringify(socketDriverDistanceKeyList) != JSON.stringify(driverNearbyList) ){
                setDriverNearbyList( JSON.parse(JSON.stringify(socketDriverDistanceKeyList)) );
            }
        });

        console.log("dfdf")

        return () => {
            socket.disconnect();
        };
    }, [ridestatus]);

    const findNearbyDriver = ( uuid ) => {
        socket.emit("findNearbyDriver", uuid );
    }

    const sendRideToNearbyDriver = ( uuid_driver_list ) => {
        let uuid_ride = uuid;
        socket.emit("sendRideNearbyDriver", { uuid_ride, uuid_driver_list });
    }

    //Hàm thêm ride vào socket
    // const bookRide = () => {        
    //     if( ride && ridestatus ){
    //         // Gửi ride cho socket
    //         console.log("here")
    //         socket.emit('bookRide', {
    //             uuid,
    //             ride_star_time: ride.rideStartTime,
    //             ride_end_time: null,
    //             starting_point: ride.startingPoint,
    //             destination_point: ride.destinationPoint,
    //             distance: ride.distance,
    //             price: ride.price,
    //             note: ride.note,
    //             driver_id: ridestatus.driverId,
    //             driver_shift_id: ridestatus.driverShiftId,
    //             state: ridestatus.state,
    //             state_time: ridestatus.stateTime,
    //             state_detail: ridestatus.stateDetail
    //             /*
    //             uuid: "ride_1234524",
    //             ride_star_time: Date.now(),
    //             ride_end_time: null,
    //             starting_point: "10.730060049999999;106.69977554999998;632 Lê Văn Lương",
    //             destination_point: "10.741029216315445;106.70174422162565;Lotte",
    //             distance: 0,
    //             price: 10000,
    //             note: null,
    //             driver_id: null,
    //             driver_shift_id: null,
    //             state: "CREATED",
    //             state_time: Date.now(),
    //             state_detail: ""
    //             */
    //         })
    //     }
    // };

    
    return(
        <SocketTransportationContext.Provider value={{
            myself,
            findNearbyDriver,
            driverNearbyList,
            ride,
            ridestatus,
            ridestatusList,
            driverRide,
            ratingRide,
            sendRideToNearbyDriver
        }}>
            { childrenComponent.children }
        </SocketTransportationContext.Provider>
    )
}

export { SocketTransportationContextProvider, SocketTransportationContext };