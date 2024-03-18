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
import './register.style.css';
// Be API
import { beAPI } from '../../api';
import { handlingDateTime } from "../../utils";

function Register() {
    const [loginForm] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const submitRegisterForm = async (e) => {
        e.preventDefault();

        let newUser = {
            fullName: e.target.elements["fullname-input"].value,
            gender: e.target.elements["gender-select"].value == "defaultvalue" ? "male" : e.target.elements["gender-select"].value,
            phone: e.target.elements["phone-input"].value,
            password: e.target.elements["password-input"].value,
            role: "Customer",
            dob: handlingDateTime.convertDOBStringToISODate(e.target.elements["dob-datepicker"].value),
            cic: parseInt(Date.now() * Math.random(), 10).toString()
        }
        
        let registerResponse = await beAPI.post("/user/register", newUser);
        if(registerResponse.status == 201){

            messageApi.open({
                type: 'success',
                content: "Đăng ký thành công, vui lòng đợi",
            });

            localStorage.setItem('uuid', registerResponse.data.data.uuid);
            localStorage.setItem('fullName', registerResponse.data.data.fullName);
            localStorage.setItem('gender', registerResponse.data.data.gender);
            localStorage.setItem('address', registerResponse.data.data.address);
            localStorage.setItem('phone', registerResponse.data.data.phone);
            localStorage.setItem('email', registerResponse.data.data.email);
            localStorage.setItem('role', registerResponse.data.data.role);
            localStorage.setItem('dob', registerResponse.data.data.dob);
            localStorage.setItem('cic', registerResponse.data.data.cic);
            localStorage.setItem('avatar', registerResponse.data.data.avatar);
            localStorage.setItem('createdAt', registerResponse.data.data.createdAt);

            
            setTimeout(() => {
                window.location.href = `/`;
            }, 1000);
        }

        else{
            messageApi.open({
                type: 'error',
                content: "Lỗi không thể đăng ký",
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
                        
                        <section style={{backgroundImage: `url(${require("../../assets/images/taxi_auth_bg.jpg")})`,backgroundSize: "cover"}}>
                            <form id="register-form" onSubmit={submitRegisterForm}>
                                <div className="fullname-input">
                                    <input type="text" name="fullname-input" placeholder="Họ và tên" required/>
                                </div>

                                <div className="phone-input">
                                    <input type="tel" name="phone-input" placeholder="Số điện thoại" required/>
                                </div>

                                <div className="password-input">
                                    <input type="password" name="password-input" placeholder="Mật khẩu" required/>
                                </div>

                                <div className="select-input">
                                    <select name="gender-select" style={{backgroundColor: "rgba(0, 0, 0, 0.2)"}} defaultValue="defaultvalue">
                                        <option value="defaultvalue" disabled style={{display: "none"}}>Giới tính</option>
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                    </select>
                                </div>

                                <div className="date-input">
                                    <input type="date" name="dob-datepicker" placeholder="Ngày sinh" required/>
                                </div>
                            </form>
                        </section>

                        <button form="register-form" type="submit">Đăng ký</button>
                    </div>
                </div>
            </div>
        </>
    )
}


export default Register;