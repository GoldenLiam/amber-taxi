// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
//Boostrap icon 5
import 'bootstrap-icons/font/bootstrap-icons.css';


import { React, useEffect, useState } from "react";
import { MenuNavbar } from "../../components";
import { Avatar, Card as CardAntd, Button, Skeleton, Switch, Rate, Divider, Space, Tag, message,
    Typography, Checkbox, Form, Input, Select } from 'antd';

import { SearchOutlined } from '@ant-design/icons';

import Chart from '../../components/Chart/Chart';
import './login.style.css';
// Be API
import { beAPI } from '../../api';
import { handlingDateTime } from "../../utils";

function Login() {
    const [messageApi, contextHolder] = message.useMessage();

    const sumbitLoginForm = async (e)  => {
        e.preventDefault();

        let userLogin = {
            phone: e.target.elements["phone-input"].value,
            password: e.target.elements["password-input"].value,
            role: "Customer"
        }

        let loginResponse = await beAPI.post("/user/login", userLogin);

        if(loginResponse.data.data){
            messageApi.open({
                type: 'success',
                content: "Đăng nhập thành công, vui lòng đợi",
            });

            localStorage.setItem('uuid', loginResponse.data.data.uuid);
            localStorage.setItem('fullName', loginResponse.data.data.fullName);
            localStorage.setItem('gender', loginResponse.data.data.gender);
            localStorage.setItem('address', loginResponse.data.data.address);
            localStorage.setItem('phone', loginResponse.data.data.phone);
            localStorage.setItem('email', loginResponse.data.data.email);
            localStorage.setItem('role', loginResponse.data.data.role);
            localStorage.setItem('dob', loginResponse.data.data.dob);
            localStorage.setItem('cic', loginResponse.data.data.cic);
            localStorage.setItem('avatar', loginResponse.data.data.avatar);
            localStorage.setItem('createdAt', loginResponse.data.data.createdAt);

            setTimeout(() => {
                window.location.href = `/`;
            }, 1000);

        }
        else{
            messageApi.open({
                type: 'error',
                content: "Số điện thoại hoặc mật khẩu bị sai",
            });
        }

    }

    return (
        <> 
            {contextHolder}
            
            <div className="register-section">
                <div className="pagewrap" style={{background: `url(${require("../../assets/images/taxi_auth_bg.jpg")})`, backgroundSize: "cover"}}>
                    
                    <div className="pagewrap-overlay"></div>
                    
                    <div className="content">
                        <header>
                            <div className="header-content">
                                <h1>
                                    <span className="taxi">Amber</span>Taxi<br/>
                                    <p style={{fontSize: "24px"}}>Welcome</p>
                                </h1>
                            </div>
                        </header>
                        
                        <section style={{backgroundImage: `url(${require("../../assets/images/taxi_auth_bg.jpg")})`,backgroundSize: "cover", height: "350px"}}>
                            <form id="login-form" onSubmit={sumbitLoginForm}>
                                <div className="phone-input">
                                    <input type="tel" name="phone-input" placeholder="Số điện thoại" required/>
                                </div>

                                <div className="password-input">
                                    <input type="password" name="password-input" placeholder="Mật khẩu" required/>
                                </div>

                                <p className="text-center text-light mt-3">Chưa có tài khoản? <a href="/register">Đăng ký</a> ngay</p>
                            </form>
                           
                        </section>

                        <button form="login-form" type="submit">Đăng nhập</button>
                    </div>
                </div>
            </div>
        </>
    )
}


export default Login;