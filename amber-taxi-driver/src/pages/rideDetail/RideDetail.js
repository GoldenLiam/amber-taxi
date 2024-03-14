// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
//Boostrap icon 5
import 'bootstrap-icons/font/bootstrap-icons.css';


import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MenuNavbar } from "../../components";
import { Avatar, Card as CardAntd, Button as ButtonAntd, Skeleton, Switch, Rate, Divider, Space, Tag, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import Chart from '../../components/Chart/Chart';

import { calculateDistance, handlingDateTime } from "../../utils";
import { beAPI } from "../../api";

import "./ride-detail.style.css";

const { Meta } = CardAntd;


function RideDetail() {
    const [ratingList, setRatingList] = useState([]);
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

    const getRatingList = async () => {
        let ratingListResponse = await beAPI.get(`/rating/getAllByDriverId/${localStorage.getItem("uuid")}`);
        if(ratingListResponse.status == 200){
            if (ratingListResponse.data.data && JSON.stringify(ratingListResponse.data.data) != JSON.stringify(ratingList) ){
                setRatingList(ratingListResponse.data.data);
            }
        }
    }

    // Biến uuid của ride lấy từ params
    let { uuid } = useParams();

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

    useEffect(() => {
        if( localStorage.getItem("uuid") == null ){
            window.location.href = `/login`;
        }

        if(ridestatus.driverId == null){
            getRidestatus();
        }

        //getRatingList();
    }, [])


    return (
        <>
            <MenuNavbar />
            <>
                <div className="container-ride-detail my-4">
                    <div id="logo">
                        <i className="fab fa-lyft" />
                    </div>

                    <div className="main">
                        <h1>Chi tiết chuyến đi</h1>

                        <h2>Cảm ơn đã đồng hành cùng với Amber Taxi!</h2>

                        <p>{ridestatus.stateTime}</p>
                    </div>

                    <div className="location">
                        <img className="map" src="https://image.ibb.co/iVkNEJ/lyft.png" />
                        <div className="location__line" />
                    
                        <div className="dot pickup">
                            <div className="inner" />
                        </div>
                        <div className="location__pickup">
                            <h3>
                            Đón tại <span>11:21 AM</span>
                            </h3>
                            <p>
                            Lê Văn Lương, <br />
                            Quận 7
                            </p>
                        </div>
                        <div className="dot dropoff">
                            <div className="inner" />
                        </div>
                        <div className="location__dropoff">
                            <h3>
                            Dừng tại <span>11:45 AM</span>
                            </h3>
                            <p>
                            29A, <br />
                            Lương Minh Nguyệt
                            </p>
                        </div>
                    </div>

                    <h2 className="receipt__title">Ride Details</h2>
                    <div className="receipt">
                        <div className="receipt__grid1">
                            <p>Quãng đường</p>
                            <p>Thời gian đợi</p>
                            <p>VAT (10%)</p>
                            <p className="total">Tiền mặt</p>
                        </div>
                        <div className="receipt__grid2">
                            <p>10km</p>
                            <p>00:30:00</p>
                            <p>2.800 VNĐ</p>
                            <p className="total">28.000 vnđ</p>
                        </div>
                    </div>

                    <div className="receipt__line" />
                    
                    <div className="rate">
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                        <i className="far fa-star" />
                    </div>

                    <div className="lyft__footer">
                        <p>
                            <i className="far fa-copyright" /> Amber Taxi 2024
                            <br />
                            Lê Văn Lương Quận 7 
                            <br />
                            Thành phố Hồ Chí Minh 91000
                        </p>
                    </div>
                </div>
            </>
        </>
    )
}


export default RideDetail;