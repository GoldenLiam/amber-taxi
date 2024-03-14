/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Switch from "@mui/material/Switch";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import CoverLayoutSignIn from "layouts/authentication/components/CoverLayoutSignIn";

// Images
import curved9 from "assets/images/curved-images/curved-6.jpg";

import { beAPI } from "api";

import { message } from 'antd';


function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const [phoneInput, setPhoneInput] =  useState("");
  const [passwordInput, setPasswordInput] =  useState("");
  const [messageApi, contextHolder] = message.useMessage();


  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const sumbitLoginForm = async () => {
    let userLogin = {
      phone: phoneInput,
      password: passwordInput,
      role: "CallAgent"
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
        window.location.href = `/dashboard`;
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
      <CoverLayoutSignIn
        title="Đăng nhập Amber Taxi"
        description="Nhập số điện thoại và mật khẩu để đăng nhập"
        image={curved9}
      >
        <SoftBox component="form" role="form">
          <SoftBox mb={2}>
            <SoftBox mb={1} ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Số điện thoại
              </SoftTypography>
            </SoftBox>
            <SoftInput type="tel" placeholder="0968472xxx" onChange={(e) => setPhoneInput(e.target.value)} />
          </SoftBox>
          <SoftBox mb={2}>
            <SoftBox mb={1} ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Mật khẩu
              </SoftTypography>
            </SoftBox>
            <SoftInput type="password" placeholder="Mật khẩu" onChange={(e) => setPasswordInput(e.target.value)} />
          </SoftBox>
          <SoftBox display="flex" alignItems="center">
            <Switch checked={rememberMe} onChange={handleSetRememberMe} />
            <SoftTypography
              variant="button"
              fontWeight="regular"
              onClick={handleSetRememberMe}
              sx={{ cursor: "pointer", userSelect: "none" }}
            >
              &nbsp;&nbsp;Ghi nhớ
            </SoftTypography>
          </SoftBox>
          <SoftBox mt={4} mb={1}>
            <SoftButton variant="gradient" color="info" fullWidth onClick={sumbitLoginForm}>
              Đăng nhập
            </SoftButton>
          </SoftBox>
          <SoftBox mt={3} textAlign="center">
            <SoftTypography variant="button" color="text" fontWeight="regular">
              Không có tài khoản?{" "}
              <SoftTypography
                component={Link}
                to="/authentication/sign-up"
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
              >
                Đăng ký ngay
              </SoftTypography>
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </CoverLayoutSignIn>
    </>
  );
}

export default SignIn;
