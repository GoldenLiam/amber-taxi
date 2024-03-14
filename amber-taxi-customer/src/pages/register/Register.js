// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
//Boostrap icon 5
import 'bootstrap-icons/font/bootstrap-icons.css';


import { React, useEffect, useState } from "react";
import { MenuNavbar } from "../../components";
import { Avatar, Card as CardAntd, Button, Skeleton, Switch, Rate, Divider, Space, Tag, message } from 'antd';
import { Typography } from 'antd';
import { Checkbox, Form, Input } from 'antd';

import { SearchOutlined } from '@ant-design/icons';

import Chart from '../../components/Chart/Chart';
import './register.style.css';
// Be API
import { beAPI } from '../../api';

function Register() {
    const [loginForm] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const sumbitLoginForm = async () => {
        let userLogin = {
            phone: loginForm.getFieldValue("phone-input"),
            password: loginForm.getFieldValue("password-input"),
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

                <div className="container">

                    <div className="register">
                        <Typography.Title level={3}>ĐĂNG NHẬP</Typography.Title>
                        <Typography.Text type="secondary">Welcome to Amber Taxi !!!</Typography.Text>

                        <br/>
                        <br/>

                        <Form 
                            form={loginForm}
                            layout="horizontal"
                            labelAlign="left"
                            labelWrap
                            labelCol={{
                                flex: '110px',
                            }}
                            wrapperCol={{
                            flex: 1,
                            }}
                        >
                            <Form.Item
                                label="Số điện thoại"
                                name="phone-input"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Nhập số điện vui lòng nhập số điện thoại!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu"
                                name="password-input"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item>   
                                <Space size={"middle"}>

                                    <Button type="primary" onClick={() => sumbitLoginForm()}>
                                        Đăng nhập
                                    </Button>

                                    <div>Chưa có tài khoản? <Typography.Link> Đăng ký ngay</Typography.Link></div>

                                </Space>
                            </Form.Item>

                        </Form>
                    </div>
                    
                </div>
            </div>
        </>
    )
}


export default Register;