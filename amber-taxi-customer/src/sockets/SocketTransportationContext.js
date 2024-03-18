import React, { createContext, useState, useRef, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { io } from 'socket.io-client';
import { beAPI } from '../api';


// Khởi tạo context
const SocketTransportationContext = createContext();

// Khởi tạo socket
const socket = io('http://localhost:5010', { autoConnect: false });


const SocketTransportationContextProvider = ({ children }) => {
    
    const [socketDriver, setSocketDriver] = useState(null);

    const [rideList, setRideList] = useState([]);
    const [drivershift, setDrivershift] = useState(null);
    const [rideForUserList, setRideForUserList] = useState([]);

    const [acceptRideResult, setAcceptRideResult] = useState(null);
    const [acceptRideResultReason, setAcceptRideResultReason] = useState(null);
    
    const [pickRideResult, setPickRideResult] = useState(null);
    const [pickRideResultReason, setPickRideResultReason] = useState(null);

    const [denyRideResult, setDenyRideResult] = useState(null);
    const [denyRideResultReason, setDenyRideResultReason] = useState(null);
    
    const [completeRideResult, setCompleteRideResult] = useState(null);
    const [completeRideResultReason, setCompleteRideResultReason] = useState(null);

    //Note biến mới để định danh
    var myself = {
        uuid: "123456789",
        uuid_ride: "uuid_ride123",
        role: "Driver",
        display_name: "Driver Lưu Quang Thắng",
        display_car_model: "Xe vjp pro",
        current_location: ""
    };

    //http://localhost:3000/booking-list

    // Biến uuid của ride lấy từ params
    //let { uuid } = useParams();

    
    // Gọi để lấy ride và ride status (phải bao function ngoài vì nó là async)
    // const getRideWithStatus = async () => {

    //     let responseRideData = await beAPI.get(`/ride/${uuid}`);
    //     setRide(responseRideData.data.data);

    //     let responseRidestatusData = await beAPI.get(`/ridestatus/rideId/${uuid}`);
    //     setRidestatus(responseRidestatusData.data.data[0]);
    // }

    // getRideWithStatus();

    const getDrivershiftAndCarModel = async () => {
        let drivershiftResponse = await beAPI.get(`/drivershift/getLatestDrivershift/${localStorage.getItem("uuid")}`);
        let carResponse = await beAPI.get(`/car/${drivershiftResponse.data.data.carId}`);

        console.log(drivershiftResponse)

        if (drivershiftResponse.status == 200){
            // Ngăn chặn việc bị chạy useEffect liên tục
            if ( JSON.stringify(drivershiftResponse.data.data) != JSON.stringify(drivershift) ){
                //Định danh trước khi gọi
                socket.emit('registerBeforeHandlingRide', {
                    uuid: localStorage.getItem("uuid"), 
                    uuid_ride: null,
                    role: "Driver",
                    display_name: localStorage.getItem("fullName"),
                    display_car_model: `${carResponse.data.data.modelName} - ${carResponse.data.data.seat} chỗ`,
                    current_location: null
                });
                
                setDrivershift(drivershiftResponse.data.data);
            }
        }
    }

    useEffect(() => {

        //Mở kết nối socket
        socket.connect();

        socket.emit('registerBeforeHandlingRide', {
            uuid: localStorage.getItem("uuid"), 
            uuid_ride: null,
            role: "Customer",
            display_name: localStorage.getItem("fullName"),
            display_car_model: "",
            current_location: null,
            phone: localStorage.getItem("phone")
        });

        //
        //getDrivershiftAndCarModel();
        

        socket.on("acceptSuccess", (uuid_ride) => {
            setAcceptRideResult(true);
            setAcceptRideResultReason("Nhận cuốc thành công vui lòng đợi 2s");

            // // Chờ 2s để điều hướng
            // setTimeout(() => {
                
            //     // Điều hướng đến trang chi tiết chuyến đi
            //     window.location.href = `/trip/${uuid_ride}`;
        
            // }, 2000);
        })


        socket.on("pickSuccess", (uuid) => {
            setPickRideResult(true);
            setPickRideResultReason("Chuyển sang trạng thái thực hiện cuốc");
        });
        

        socket.on("denySuccess", (uuid_ride) => {
            setDenyRideResult(true);
            setDenyRideResultReason("Bạn đã hủy chuyến đi");

            // // Chờ 2s để điều hướng
            // setTimeout(() => {
                
            //     // Điều hướng đến trang chi tiết chuyến đi
            //     window.location.href = `/trip-detail/${uuid_ride}`;
        
            // }, 2000);
        });

        
        socket.on("completeSuccess", (uuid_ride) => {
            setCompleteRideResult(true);
            setCompleteRideResultReason("Chúc mừng cuốc xe đã hoàn thành, vui lòng đợi 2s");

            // Chờ 2s để điều hướng
            setTimeout(() => {
                
                // Điều hướng đến trang chi tiết chuyến đi
                window.location.href = `/trip-detail/${uuid_ride}`;
        
            }, 2000);
        });


        socket.on("getDriverUpdateLocationToCustomer", (socketDriverUser) => {
            console.log(socketDriverUser)
            if(JSON.stringify(socketDriverUser) != JSON.stringify(socketDriver)){
                setSocketDriver(socketDriverUser);
            }
        })


        // socket.on("sendRideList", (newRideList) => {
        //     //console.log("newRideList")
        //     //console.log(newRideList)
    
        //     // Chắc chắn là phải khác nhau mới set lại list
        //     if( JSON.stringify(rideList) != JSON.stringify(newRideList) ){
        //         setRideList( JSON.parse(JSON.stringify(newRideList)) );
        //     }
        // })

        return () => {
            socket.disconnect();
        };
    }, []);


    // const bookRide = (uuid) => {
    //     socket.emit('bookRide', uuid);
    // }

    //Hàm trả gửi location cho socket
    const updateLocation = (current_location) => {
        socket.emit('updateLocation', { current_location });
    };

    const cancelRide = (uuid) => {
        socket.emit('cancelRide', uuid);
    }

    const updateRideList = () => {
        //console.log("getRideList")
        socket.emit("getRideList");
    }
    
    
    return(
        <SocketTransportationContext.Provider value={{
            myself,
            socketDriver,

            updateLocation,
            updateRideList,
            rideList,
            drivershift,
            rideForUserList,
            
            acceptRideResult,
            acceptRideResultReason,

            pickRideResult,
            pickRideResultReason,

            denyRideResult,
            denyRideResultReason,

            completeRideResult,
            completeRideResultReason, 

            cancelRide
        }}>
            {children}
        </SocketTransportationContext.Provider>
    )
}

export { SocketTransportationContextProvider, SocketTransportationContext };