// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
//Boostrap icon 5
import 'bootstrap-icons/font/bootstrap-icons.css';


import { React, useEffect, useState } from "react";
import { MenuNavbar } from "../../components";
import { Avatar, Card as CardAntd, Button as ButtonAntd, Skeleton, Switch, Rate, Divider, Space, Tag, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import Chart from '../../components/Chart/Chart';

import { calculateDistance, handlingDateTime } from "../../utils";
import { beAPI } from "../../api";

import "./home.style.css";

const { Meta } = CardAntd;


function Home() {
    const [ratingList, setRatingList] = useState([]);

    const getRatingList = async () => {
        let ratingListResponse = await beAPI.get(`/rating/getAllByDriverId/${localStorage.getItem("uuid")}`);
        if(ratingListResponse.status == 200){
            if (ratingListResponse.data.data && JSON.stringify(ratingListResponse.data.data) != JSON.stringify(ratingList) ){
                setRatingList(ratingListResponse.data.data);
            }
        }

    }

    useEffect(() => {
        if( localStorage.getItem("uuid") == null ){
            window.location.href = `/login`;
        }

        getRatingList();
    }, [])


    return (
        <>
            <MenuNavbar />
        
            <div className="container">
                
                <div className="Trip d-flex flex-column" style={{height: '100vh'}}>

                    <div style={{backgroundColor: "#ffc000"}} className="d-flex align-items-center p-3 my-3 text-white rounded shadow-sm">
                        <img className="rounded-circle img-thumbnail"
                        src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=69" 
                        alt="" width="55" height="55" style={{border: 0}} />
                        
                        <div className="lh-1 mx-1">
                            <h1 className="h5 mb-0 text-white lh-1">{localStorage.getItem("fullName")}</h1>
                        </div>
                    </div>

                                        
                    <div className="btn-action-container">
                        <button type="button" class="btn btn--yellow">
                            <span class="btn__txt">ĐẶT XE</span>
                            <i class="btn__bg" aria-hidden="true"></i>
                            <i class="btn__bg" aria-hidden="true"></i>
                            <i class="btn__bg" aria-hidden="true"></i>
                            <i class="btn__bg" aria-hidden="true"></i>
                        </button>

                        <button type="button" class="btn btn--purple">
                            <span class="btn__txt">ĐẶT ĐỒ ĂN</span>
                            <i class="btn__bg" aria-hidden="true"></i>
                            <i class="btn__bg" aria-hidden="true"></i>
                            <i class="btn__bg" aria-hidden="true"></i>
                            <i class="btn__bg" aria-hidden="true"></i>
                        </button>

                        <button type="button" class="btn btn--green">
                            <span class="btn__txt">LỊCH SỬ</span>
                            <i class="btn__bg" aria-hidden="true"></i>
                            <i class="btn__bg" aria-hidden="true"></i>
                            <i class="btn__bg" aria-hidden="true"></i>
                            <i class="btn__bg" aria-hidden="true"></i>
                        </button>
                        
                        <button type="button" class="btn btn--blue">
                            <span class="btn__txt">GÓP Ý</span>
                            <i class="btn__bg" aria-hidden="true"></i>
                            <i class="btn__bg" aria-hidden="true"></i>
                            <i class="btn__bg" aria-hidden="true"></i>
                            <i class="btn__bg" aria-hidden="true"></i>
                        </button>

                    </div>


                    <div className="row">

                        <div className="col-md-9 col-sm-12">
                            <div className="my-3 p-3 bg-body rounded shadow-sm">
                                <h6 className="border-bottom pb-2 mb-0">Đánh giá gần nhất</h6>

                                {ratingList.length == 0 &&
                                    <Empty description="Chưa có đánh giá nào"/>
                                }

                                {ratingList.length > 0 &&
                                <>
                                    {ratingList.map((rating, i) => 
                                    <>
                                    <div className="d-flex text-muted pt-3">
                                        <Avatar style={{ padding: '2px', border: "2px solid #ffc000" }} src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />

                                        <p className="mx-2 pb-3 mb-0 small lh-sm border-bottom w-100">
                                            <strong className="d-block text-gray-dark">
                                                {rating.user_rating_driverIdTouser.fullName}
                                                
                                                <span className="mx-2 text-warning">
                                                    {rating.ratingValue - 1 >= 0 ? <i className="bi bi-star-fill"></i> : <i className="bi bi-star"></i>}
                                                    {rating.ratingValue - 2 >= 0 ? <i className="bi bi-star-fill"></i> : <i className="bi bi-star"></i>}
                                                    {rating.ratingValue - 3 >= 0 ? <i className="bi bi-star-fill"></i> : <i className="bi bi-star"></i>}
                                                    {rating.ratingValue - 4 >= 0 ? <i className="bi bi-star-fill"></i> : <i className="bi bi-star"></i>}
                                                    {rating.ratingValue - 5 >= 0 ? <i className="bi bi-star-fill"></i> : <i className="bi bi-star"></i>}
                                                </span>

                                            </strong>
                                            
                                            {rating.ratingComment}

                                            <div>
                                                <Space size={[0, 8]} wrap className="mt-2">
                                                    {rating.ratingTag.split(";").map((tag, i) => <Tag color="gold" key={i}>{tag}</Tag>)} 
                                                </Space>
                                            </div>
                                        </p>
                                    </div>
                                    </>
                                    )}
                                    

                                    <small className="d-block text-end mt-3">
                                                                        
                                    <ButtonAntd type="dashed">
                                        <a style={{textDecoration: "none"}} href="https://getbootstrap.com/docs/5.0/examples/offcanvas-navbar/#">Xem tất cả</a>
                                    </ButtonAntd>

                                    </small>
                                </>
                                }

                            </div>

                            <div class="information-card" >
                                <div class="card__img" id="img01"></div>
                                <div class="card__content"> 
                                    <p class="card__content-theme">Tổng đài</p>
                                    <h2 class="card__content-header">CSKH Amber Taxi</h2>
                                    <p class="card__content-paragraph">
                                    Trong suốt quá trình tham gia hoạt động dịch vụ của Amber Taxi, đôi khi bạn sẽ rất cần liên hệ tổng đài hỗ trợ. Các tình huống liên quan đến vấn đề thanh toán, lỗi giao dịch hoặc cần hỗ trợ về các vấn đề tài chính. Bằng cách liên trao đổi qua tổng đài, bạn sẽ có được giải đáp nhanh chóng nhất.
                                    </p><a class="card__content-link">Gọi ngay 1900</a>
                                </div>
                            </div>

                            <Divider>
                                <div class="bg"></div>
                                    <div class="rect">
                                    <div class="rect-label">
                                        NEWS <br />
                                        <span class="small">tin tức</span>
                                    </div>
                                </div>
                            </Divider>

                            <div className="news-container">

                                <div className="content-wrapper">
    
                                    <div className="news-card">
                                        <a href="#" className="news-card__card-link"></a>
                                        <img src={require("../../assets/images/night_taxi.jpg")} alt="" className="news-card__image"/>
                                        <div className="news-card__text-wrapper">
                                        <h2 className="news-card__title">Làm ca đêm nên lưu ý điều gì</h2>
                                        <div className="news-card__post-date">29 tháng 2, 2024</div>
                                            <div className="news-card__details-wrapper">
                                                <p className="news-card__excerpt">Tầm nhìn hạn chế, mức độ nguy hiểm và rủi ro sẽ tăng lên khi điều khiển xe trong đêm tối. Do đó, tài xế cũng cần có những kinh nghiệm và bí quyết nhất định&hellip;</p>
                                                <ButtonAntd ghost>Xem thêm</ButtonAntd>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="news-card">
                                        <a href="#" className="news-card__card-link"></a>
                                        <img src={require("../../assets/images/cleaning_car.jpg")} alt="" className="news-card__image"/>
                                        <div className="news-card__text-wrapper">
                                        <h2 className="news-card__title">Làm sao để vệ sinh xe đúng cách</h2>
                                        <div className="news-card__post-date">28 tháng 2, 2024</div>
                                            <div className="news-card__details-wrapper">
                                                <p className="news-card__excerpt">Việc dọn xe thường xuyên sẽ giúp cho chiếc xe của bạn hoạt động hiệu quả, bề ngoài của chiếc xe cũng đẹp hơn&hellip;</p>
                                                <ButtonAntd ghost>Xem thêm</ButtonAntd>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="news-card">
                                        <a href="#" className="news-card__card-link"></a>
                                        <img src={require("../../assets/images/future_taxi.jpg")} alt="" className="news-card__image"/>
                                        <div className="news-card__text-wrapper">
                                        <h2 className="news-card__title">Taxi thời đại mới</h2>
                                        <div className="news-card__post-date">27 tháng 2, 2024</div>
                                            <div className="news-card__details-wrapper">
                                                <p className="news-card__excerpt">Theo nhiều chuyên gia, thị trường taxi tự lái vẫn đang nổi lên và có thể trở thành tương lai của ngành taxi tại Mỹ.&hellip;</p>
                                                <ButtonAntd ghost>Xem thêm</ButtonAntd>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="news-card">
                                        <a href="#" className="news-card__card-link"></a>
                                        <img src={require("../../assets/images/stats.jpg")} alt="" className="news-card__image"/>
                                        <div className="news-card__text-wrapper">
                                        <h2 className="news-card__title">Thống kê ngành taxi</h2>
                                        <div className="news-card__post-date">27 tháng 2, 2024</div>
                                            <div className="news-card__details-wrapper">
                                                <p className="news-card__excerpt">Giá vé taxi giảm và dễ dàng đặt chỗ qua ứng dụng di động là những yếu tố chính giúp dịch vụ taxi hiện đại chiếm được thị phần lớn trên thị trường taxi Việt Nam&hellip;</p>
                                                <ButtonAntd ghost>Xem thêm</ButtonAntd>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="news-card">
                                        <a href="#" className="news-card__card-link"></a>
                                        <img src={require("../../assets/images/taxi-sunrise.jpg")} alt="" className="news-card__image"/>
                                        <div className="news-card__text-wrapper">
                                        <h2 className="news-card__title">Những thời gian đẹp nhất trong ngày</h2>
                                        <div className="news-card__post-date">27 tháng 2, 2024</div>
                                            <div className="news-card__details-wrapper">
                                                <p className="news-card__excerpt">Nắm bắt được khung giờ để đón khách hàng chính là chìa khóa sống còn trong ngành taxi&hellip;</p>
                                                <ButtonAntd ghost>Xem thêm</ButtonAntd>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="news-card">
                                        <a href="#" className="news-card__card-link"></a>
                                        <img src={require("../../assets/images/taxi-customer.jpg")} alt="" className="news-card__image"/>
                                        <div className="news-card__text-wrapper">
                                        <h2 className="news-card__title">Mẹo nâng cao trải nghiệm khách hàng</h2>
                                        <div className="news-card__post-date">27 tháng 2, 2024</div>
                                            <div className="news-card__details-wrapper">
                                                <p className="news-card__excerpt">Khi thị trường ngày càng trở nên bão hòa, những yếu tố như chất lượng sản phẩm dịch vụ, cách thức bán hàng, hình ảnh quảng cáo ngày càng dễ dàng sao chép thì chính trải nghiệm khách hàng sẽ là yếu tố cạnh tranh hàng đầu&hellip;</p>
                                                <ButtonAntd ghost>Xem thêm</ButtonAntd>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
    
    


                        </div>
                        
                        <div className="col-md-3 col-sm-12">
                            <div className="my-3 p-3 bg-body rounded shadow-sm">
                                
                                <div className="row">
                                    <div className="col-4 d-flex flex-column align-items-center">
                                        <ButtonAntd type="default" shape="circle" icon={<i className="bi bi-bell"></i>} size={"large"} />
                                        <small style={{fontSize: "12px"}}>Thông báo</small>
                                    </div>

                                    <div className="col-4 d-flex flex-column align-items-center">
                                        <ButtonAntd type="default" shape="circle" icon={<i className="bi bi-newspaper"></i>} size={"large"} />
                                        <small style={{fontSize: "12px"}}>Tin tức</small>
                                    </div>

                                    <div className="col-4 d-flex flex-column align-items-center">
                                        <ButtonAntd type="default" shape="circle" icon={<i className="bi bi-graph-up"></i>} size={"large"} />
                                        <small style={{fontSize: "12px"}}>Thống kê</small>
                                    </div>
                                </div>

                                <div className="row mt-4">
                                    <div className="col-4 d-flex flex-column align-items-center">
                                        <ButtonAntd href="/booking-list" type="default" shape="circle" icon={<i className="bi bi-ev-front"></i>} size={"large"} />
                                        <small style={{fontSize: "12px"}}>Cuốc xe</small>
                                    </div>

                                    <div className="col-4 d-flex flex-column align-items-center">
                                        <ButtonAntd type="default" shape="circle" icon={<i className="bi bi-shield-plus"></i>} size={"large"} />
                                        <small style={{fontSize: "12px"}}>Trung tâm</small>
                                    </div>

                                    <div className="col-4 d-flex flex-column align-items-center">
                                        <ButtonAntd type="default" shape="circle" icon={<i className="bi bi-gear"></i>} size={"large"} />
                                        <small style={{fontSize: "12px"}}>Thiết lập</small>
                                    </div>
                                </div>

                            </div>

                            <div className="container-fluid mx-auto" style={
                                {
                                    "color":"#fff",
                                    "overflowX":"hidden",
                                    "height":"100%",
                                    "backgroundRepeat":"no-repeat",
                                }
                            }>
                                <div className="row d-flex justify-content-center">
                                    <div className="card" style={
                                        {
                                            "color":"#fff",
                                            "backgroundImage":`url(${require("../../assets/images/morning_cloud.avif")})`,
                                            "backgroundSize":"cover",
                                            "borderRadius":"10px",
                                            "boxShadow": "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                                            height: "500px",
                                        }
                                    }>
                                        <h2 className="ml-auto mr-4 mt-3 mb-0" style={{textAlign: 'right'}}>Quận 7, TPHCM</h2>
                                        <p className="ml-auto mr-4 mb-0 med-font" style={{textAlign: 'right'}}>
                                            <span className="d-flex flex-column">
                                                
                                                <h1><i className="bi bi-brightness-high mx-3"></i></h1> Trời nắng 
                                            </span>
                                            
                                        </p>
                                        <h1 className="ml-auto mr-4 large-font" style={{textAlign: 'right'}}>28&#176;</h1>
                                        <p className="time-font mb-0 ml-4 mt-auto">08:30 <span className="sm-font">AM</span></p>
                                        <p className="ml-4 mb-4">Thứ 4, 24 tháng 10 2023</p>

                                        
                                        <div className="row mb-2 d-flex flex-row justify-content-center">

                                            <div className="col-3">
                                                <div className="text-center">
                                                    10:00
                                                    <h3>
                                                        <i className="bi bi-cloud-drizzle"></i>
                                                    </h3> 23&#176; 
                                                </div>
                                            </div>

                                            <div className="col-3">
                                                <div className="text-center">
                                                    12:00
                                                    <h3>
                                                        <i className="bi bi-cloud-lightning-rain"></i>
                                                    </h3> 22&#176; 
                                                </div>
                                            </div>

                                            <div className="col-3">
                                                <div className="text-center">
                                                    14:00
                                                    <h3>
                                                        <i className="bi bi-wind"></i>
                                                    </h3> 24&#176; 
                                                </div>
                                            </div>

                                            <div className="col-3">
                                                <div className="text-center">
                                                    16:00
                                                    <h3>
                                                        <i className="bi bi-brightness-high"></i>
                                                    </h3> 28&#176; 
                                                </div>
                                            </div>

                                        </div>
                                        
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                    </div>

                </div>

            </div>
        </>
    )
}


export default Home;