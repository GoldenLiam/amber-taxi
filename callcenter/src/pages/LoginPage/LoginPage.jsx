import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import './style.css'
import { loginUser } from '../../services/UserService';
import { useNavigate } from 'react-router-dom';

import '../../assets/css/sb-admin-2.min.css';
import '../../assets/vendor/fontawesome-free/css/all.min.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const handleOnChangeEmail = (event) => {
        setEmail(event.target.value)
    }

    const handleOnChangePassword = (event) => {
        setPassword(event.target.value)
    }

    const handleLogin = async () => {
        console.log(email, password)
        const res = await loginUser(email, password)
        if (res.message === 'SUCCESS' && (res.role === 'Admin' || res.role === 'CallAgent')) {
            localStorage.setItem('agentName', res.agentName);
            localStorage.setItem('agentUuid', res.agentUuid);
            navigate('/')
        } else {
            messageApi.open({
                type: 'error',
                content: 'ERROR',
            });
        }
    }

    return (
        // <>
        //     {contextHolder}
        //     <Form
        //         name="normal_login"
        //         className="login-form"
        //         initialValues={{
        //             remember: true,
        //         }}
        //     >
        //         <Form.Item
        //             name="email"
        //             rules={[
        //                 {
        //                     // required: true,
        //                     // message: 'Please input your Email!',
        //                 },
        //             ]}
        //         >
        //             <Input
        //                 prefix={<UserOutlined className="site-form-item-icon" />}
        //                 placeholder="Email"
        //                 onChange={handleOnChangeEmail}
        //             />
        //         </Form.Item>
        //         <Form.Item
        //             name="password"
        //             rules={[
        //                 {
        //                     // required: true,
        //                     // message: 'Please input your Password!',
        //                 },
        //             ]}
        //         >
        //             <Input
        //                 prefix={<LockOutlined className="site-form-item-icon" />}
        //                 type="password"
        //                 placeholder="Password"
        //                 onChange={handleOnChangePassword}
        //             />
        //         </Form.Item>
        //         <Form.Item>
        //             <Form.Item name="remember" valuePropName="checked" noStyle>
        //                 <Checkbox>Remember me</Checkbox>
        //             </Form.Item>
        //         </Form.Item>
        //         <Form.Item>
        //             <Button type="primary" htmlType="submit" className="login-form-button" onClick={handleLogin}>
        //                 Log in
        //             </Button>
        //         </Form.Item>
        //     </Form>
        // </>

        <>
            {contextHolder}
            <div className="bg-gradient-primary" style={{ height: '100vh' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-10 col-lg-12 col-md-9">
                            <div className="card o-hidden border-0 shadow-lg my-5">
                                <div className="card-body p-0">
                                    <div className="row">
                                        <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                                        <div className="col-lg-6">
                                            <div className="p-5">
                                                <div className="text-center">
                                                    <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                                </div>
                                                <form className="user">
                                                    <div className="form-group">
                                                        <input type="email" className="form-control form-control-user" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Enter Email Address..." onChange={handleOnChangeEmail}/>
                                                    </div>
                                                    <div className="form-group">
                                                        <input type="password" className="form-control form-control-user" id="exampleInputPassword" placeholder="Password" onChange={handleOnChangePassword}/>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="custom-control custom-checkbox small">
                                                            <input type="checkbox" className="custom-control-input" id="customCheck" />
                                                            <label className="custom-control-label" htmlFor="customCheck">Remember Me</label>
                                                        </div>
                                                    </div>
                                                    <input type="button" className="btn btn-primary btn-user btn-block" value="Login" onClick={handleLogin} />
                                                    {/* <hr />
                                                <a href="index.html" className="btn btn-google btn-user btn-block">
                                                    <i className="fab fa-google fa-fw"></i> Login with Google
                                                </a>
                                                <a href="index.html" className="btn btn-facebook btn-user btn-block">
                                                    <i className="fab fa-facebook-f fa-fw"></i> Login with Facebook
                                                </a> */}
                                                </form>
                                                {/* <hr />
                                            <div className="text-center">
                                                <a className="small" href="forgot-password.html">Forgot Password?</a>
                                            </div>
                                            <div className="text-center">
                                                <a className="small" href="register.html">Create an Account!</a>
                                            </div> */}
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
    );
}

export default LoginPage;