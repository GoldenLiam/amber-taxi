import React, { createContext, useState, useRef, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { io } from 'socket.io-client';
import { beAPI } from '../api';


// Khởi tạo context
const SocketTransportationContext = createContext();

// Khởi tạo socket
const socket = io('http://localhost:5010', { autoConnect: false });


const SocketTransportationContextProvider = ({ children }) => {
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
                    current_location: null,
                    phone: localStorage.getItem("phone")
                });
                
                setDrivershift(drivershiftResponse.data.data);
            }
        }
    }

    useEffect(() => {

        //Mở kết nối socket
        socket.connect();

        //
        getDrivershiftAndCarModel();

        /*
        uuid: item.uuid,
        full_name: item.fullName,
        gender: item.gender,
        phone: item.phone,
        seat: item.seat,
        ride_start_time: item.rideStartTime,
        ride_end_time: null,
        starting_point: item.startingPoint,
        destination_point: item.destinationPoint,
        distance: item.distance,
        price: item.price,
        note: item.note,

        driver_id: ridestatusInDB.driverId,
        driver_shift_id: ridestatusInDB.driverShiftId,
        state: ridestatusInDB.state,
        state_time: ridestatusInDB.stateTime,
        state_detail: ridestatusInDB.stateDetail
        */

        socket.on("getRideNearbyDriver", (ride) => {
            let originalRideForUserList = [...rideForUserList];
            originalRideForUserList.push({
                key: ride.uuid,
                full_name: ride.full_name,
                gender: ride.gender,
                phone: ride.phone,
                seat: ride.seat,
                ride_start_time: ride.ride_start_time,
                ride_end_time: ride.ride_end_time,
                starting_point: ride.starting_point,
                destination_point: ride.destination_point,
                distance: ride.distance,
                price: ride.price,
                note: ride.note,
            });

            if (JSON.stringify(originalRideForUserList) != JSON.stringify(rideForUserList)){
                setRideForUserList(originalRideForUserList)
            }
        })

        socket.on("acceptSuccess", (uuid_ride) => {
            setAcceptRideResult(true);
            setAcceptRideResultReason("Nhận cuốc thành công vui lòng đợi 2s");

            // Chờ 2s để điều hướng
            setTimeout(() => {
                
                // Điều hướng đến trang chi tiết chuyến đi
                window.location.href = `/trip/${uuid_ride}`;
        
            }, 2000);
        })

        socket.on("acceptFail", (message) => {
            setAcceptRideResult(false);
            setAcceptRideResultReason(message);
        })

        socket.on("pickSuccess", (uuid) => {
            setPickRideResult(true);
            setPickRideResultReason("Chuyển sang trạng thái thực hiện cuốc");
        });

        socket.on("pickFail", (uuid_ride) => {
            setPickRideResult(false);
            setPickRideResultReason("Không thể đón khách hàng");
        });

        socket.on("denySuccess", (uuid_ride) => {
            setDenyRideResult(true);
            setDenyRideResultReason("Bạn đã hủy chuyến đi");

            // Chờ 2s để điều hướng
            setTimeout(() => {
                
                // Điều hướng đến trang chi tiết chuyến đi
                window.location.href = `/trip-detail/${uuid_ride}`;
        
            }, 2000);
        });

        socket.on("denyFail", (uuid_ride) => {
            setDenyRideResult(false);
            setDenyRideResultReason("Bạn không thể hủy chuyến đi khi đã ở trạng thái này");
        })

        socket.on("completeSuccess", (uuid_ride) => {
            setCompleteRideResult(true);
            setCompleteRideResultReason("Chúc mừng cuốc xe đã hoàn thành, vui lòng đợi 2s");

            // Chờ 2s để điều hướng
            setTimeout(() => {
                
                // Điều hướng đến trang chi tiết chuyến đi
                window.location.href = `/trip-detail/${uuid_ride}`;
        
            }, 2000);
        });

        socket.on("completeFail", (uuid_ride) => {
            setCompleteRideResult(false);
            setCompleteRideResultReason("Chưa thể hoàn thành chuyên đi");
        });



        socket.on("sendRideList", (newRideList) => {
            //console.log("newRideList")
            //console.log(newRideList)
    
            // Chắc chắn là phải khác nhau mới set lại list
            if( JSON.stringify(rideList) != JSON.stringify(newRideList) ){
                setRideList( JSON.parse(JSON.stringify(newRideList)) );
            }
        })

        return () => {
            socket.disconnect();
        };
    }, []);


    //Hàm trả gửi location cho socket
    const updateLocation = (current_location) => {
        socket.emit('updateLocation', { current_location });
    };

    const driverUpdateLocationToCustomer = (current_location, phone) => {
        socket.emit('driverUpdateLocationToCustomer', { current_location, phone });
    }

    const acceptRide = (uuid) => {
        socket.emit('acceptRide', uuid);
    }

    const pickRide = (uuid) => {
        socket.emit('pickRide', uuid);
    }

    const denyRide = (uuid, reason_deny) => {
        socket.emit('denyRide', uuid);
    }

    const completeRide = (uuid) => {
        socket.emit('completeRide', uuid);
    }

    const updateRideList = () => {
        //console.log("getRideList")
        socket.emit("getRideList");
    }
    
    
    return(
        <SocketTransportationContext.Provider value={{
            myself,
            driverUpdateLocationToCustomer,
            updateLocation,
            updateRideList,
            rideList,
            drivershift,
            rideForUserList,

            acceptRide,
            acceptRideResult,
            acceptRideResultReason,

            pickRide,
            pickRideResult,
            pickRideResultReason,

            denyRide,
            denyRideResult,
            denyRideResultReason,

            completeRide,
            completeRideResult,
            completeRideResultReason, 
        }}>
            {children}
        </SocketTransportationContext.Provider>
    )
}

export { SocketTransportationContextProvider, SocketTransportationContext };