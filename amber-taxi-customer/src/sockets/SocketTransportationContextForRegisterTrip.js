import React, { createContext, useState, useRef, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { io } from 'socket.io-client';
import { beAPI } from '../api';


// Khởi tạo context
const SocketTransportationContextForRegisterTrip = createContext();

// Khởi tạo socket
const socket = io('http://localhost:5010', { autoConnect: false });


const SocketTransportationContextProviderForRegisterTrip = ({ children }) => {
    const [acceptRideResult, setAcceptRideResult] = useState(null);
    const [acceptRideResultReason, setAcceptRideResultReason] = useState(null);
    
    const [denyRideResult, setDenyRideResult] = useState(null);
    const [denyRideResultReason, setDenyRideResultReason] = useState(null);

    const [cancelRideResult, setCancelRideResult] = useState(null);
    const [cancelRideResultReason, setCancelRideResultReason] = useState(null);
    
    //Note biến mới để định danh
    var myself = {
        uuid: "123456789",
        uuid_ride: "uuid_ride123",
        role: "Driver",
        display_name: "Driver Lưu Quang Thắng",
        display_car_model: "Xe vjp pro",
        current_location: ""
    };


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
        });

        socket.on("cancelSuccess", (uuid_ride) => {
            setCancelRideResult(true);
            setCancelRideResultReason("Bạn đã hủy chuyến đi");
        });

        socket.on("cancelFail", (uuid_ride) => {
            setCancelRideResult(false);
            setCancelRideResultReason("Bạn không thể hủy chuyến đi khi đã ở trạng thái này");
        });


        return () => {
            socket.disconnect();
        };
    }, []);


    const bookRide = (uuid) => {
        socket.emit('bookRide', uuid);
    }

    //Hàm trả gửi location cho socket
    const updateLocation = (current_location) => {
        socket.emit('updateLocation', { current_location });
    };

    
    const cancelRide = (uuid) => {
        socket.emit('cancelRide', uuid);
    }
    
    return(
        <SocketTransportationContextForRegisterTrip.Provider value={{
            myself,
            updateLocation,

            bookRide,

            acceptRideResult,
            acceptRideResultReason,

            cancelRide,
            cancelRideResult,
            cancelRideResultReason
        }}>
            {children}
        </SocketTransportationContextForRegisterTrip.Provider>
    )
}

export { SocketTransportationContextProviderForRegisterTrip, SocketTransportationContextForRegisterTrip };