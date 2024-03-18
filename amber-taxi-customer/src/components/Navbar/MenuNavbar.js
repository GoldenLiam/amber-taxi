import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';

//Boostrap icon 5
import 'bootstrap-icons/font/bootstrap-icons.css';

import "./menunavbar.style.css";


function MenuNavbar( data ) {

    const logoutUser = () => {
        localStorage.clear();
        window.location.href = "/login";
    }
    
    return (
        <>
            <div className='menu-navbar-section'>
                <div className="wrap">
                    <div className="container">
                        <div className="row justify-content-between">
                            <div className="col">
                                <p className="mb-0 phone"><i class="bi bi-telephone" style={{color: "white"}}></i> <a href="#">+096847914</a></p>
                            </div>
                            <div className="col d-flex justify-content-end">
                                <div className="social-media">
                                    <p className="mb-0 d-flex">
                                        <a href="#" className="d-flex align-items-center justify-content-center">
                                            <i style={{color: "white"}} class="bi bi-facebook"></i>
                                        </a>
                                        <a href="#" className="d-flex align-items-center justify-content-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                x="0"
                                                y="0"
                                                viewBox="0 0 256 256"
                                            >
                                                <g
                                                    strokeMiterlimit="10"
                                                    fontFamily="none"
                                                    fontSize="none"
                                                    fontWeight="none"
                                                    textAnchor="none"
                                                    style={{ mixBlendMode: "normal" }}
                                                    fillOpacity="0"
                                                >
                                                    <path d="M0 256V0h256v256z"></path>
                                                </g>
                                                <path
                                                    fill="#fff"
                                                    strokeMiterlimit="10"
                                                    d="M9 4C6.25 4 4 6.25 4 9v32c0 2.75 2.25 5 5 5h32c2.75 0 5-2.25 5-5V9c0-2.75-2.25-5-5-5zm0 2h6.58C12.01 9.716 10 14.518 10 19.5c0 5.16 2.11 10.1 5.91 13.84.12.21.22 1.24-.24 2.43-.29.75-.87 1.73-1.99 2.1a.997.997 0 00-.68 1.01c.03.45.36.83.8.92 2.87.57 4.73-.29 6.23-.97 1.35-.62 2.24-1.04 3.61-.48 2.8 1.09 5.78 1.65 8.86 1.65 4.094 0 8.031-1 11.5-2.887V41c0 1.668-1.332 3-3 3H9c-1.668 0-3-1.332-3-3V9c0-1.668 1.332-3 3-3zm24 9c.55 0 1 .45 1 1v9c0 .55-.45 1-1 1s-1-.45-1-1v-9c0-.55.45-1 1-1zm-15 1h5c.36 0 .7.2.88.52.17.31.16.7-.03 1.01L19.8 24H23c.55 0 1 .45 1 1s-.45 1-1 1h-5c-.36 0-.7-.2-.88-.52-.17-.31-.16-.7.03-1.01L21.2 18H18c-.55 0-1-.45-1-1s.45-1 1-1zm9.5 3c.61 0 1.18.17 1.69.45.18-.26.46-.45.81-.45.55 0 1 .45 1 1v5c0 .55-.45 1-1 1-.35 0-.63-.19-.81-.45-.51.28-1.08.45-1.69.45-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5zm11 0c1.93 0 3.5 1.57 3.5 3.5S40.43 26 38.5 26 35 24.43 35 22.5s1.57-3.5 3.5-3.5zm-11 2a1.513 1.513 0 00-1.244.66 1.492 1.492 0 00-.256.84 1.513 1.513 0 00.66 1.244 1.492 1.492 0 00.84.256 1.497 1.497 0 001.5-1.5c0-.83-.67-1.5-1.5-1.5zm11 0a1.513 1.513 0 00-1.06.44A1.502 1.502 0 0037 22.5a1.513 1.513 0 00.66 1.244 1.506 1.506 0 00.84.256 1.497 1.497 0 001.5-1.5c0-.83-.67-1.5-1.5-1.5z"
                                                    fontFamily="none"
                                                    fontSize="none"
                                                    fontWeight="none"
                                                    textAnchor="none"
                                                    transform="scale(5.12)"
                                                ></path>
                                            </svg>
                                        </a>
                                        <a href="#" className="d-flex align-items-center justify-content-center">
                                            <i style={{color: "white"}} class="bi bi-dribbble"></i>
                                        </a>
                                        <a href="#" className="d-flex align-items-center justify-content-center">
                                            <i style={{color: "white"}} class="bi bi-globe"></i>
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
                    <div className="container">
                        <a className="navbar-brand" href="/">Amber <span>Taxi</span></a>
                        <form action="#" className="searchform order-sm-start order-lg-last">
                    <div className="form-group d-flex">
                        <input type="text" className="form-control pl-3" placeholder="Search"/>
                        <button type="submit" placeholder="" className="form-control search"><i class="bi bi-search"></i></button>
                    </div>
                    </form>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                    <i class="bi bi-list"></i> Menu
                    </button>
                    <div className="collapse navbar-collapse" id="ftco-nav">
                        <ul className="navbar-nav m-auto">
                            <li className="nav-item active"><a href="#" className="nav-link">Trang chủ</a></li>
                            <li className="nav-item"><a href="#" className="nav-link">Tin tức</a></li>
                            <li className="nav-item"><a href="#" className="nav-link">Blog</a></li>
                            <li className="nav-item"><a href="#" className="nav-link">Về chúng tôi</a></li>
                            <NavDropdown
                                title={localStorage.getItem("fullName")}
                                id={`offcanvasNavbarDropdown-expand-md`}
                            >
                                <NavDropdown.Item href="#action3">
                                    Thiết lập tài khoản
                                </NavDropdown.Item>

                                <NavDropdown.Item href="#action4">
                                    Báo cáo sự cố
                                </NavDropdown.Item>

                                <NavDropdown.Divider />

                                <NavDropdown.Item onClick={logoutUser}>
                                    Đăng xuất
                                </NavDropdown.Item>
                            </NavDropdown>
                        </ul>
                    </div>
                    </div>
                </nav>
            </div>
        </>
    );
}

export default MenuNavbar;