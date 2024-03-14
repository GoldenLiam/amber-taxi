// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";

// Soft UI Dashboard React base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
import BuildByDevelopers from "layouts/dashboard/components/BuildByDevelopers";
import WorkWithTheRockets from "layouts/dashboard/components/WorkWithTheRockets";
import Projects from "layouts/dashboard/components/Projects";
import OrderOverview from "layouts/dashboard/components/OrderOverview";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";

// Socket calling
import { SocketCallingContextProvider } from 'sockets/SocketCallingContext';
import { SocketCallingContext } from "sockets/SocketCallingContext";

// React
import React, { useState, useContext, useEffect } from 'react';
import { ButtonBase } from "@mui/material";

function Calling() {

    const socketCallingContext = useContext(SocketCallingContext);
    const { me, myself, callAccepted, name, setName, callEnded, leaveCall, callUser, myVideo, userVideo, stream, call, answerCall } = socketCallingContext;

    const [idToCall, setIdToCall] = useState('');
    const [callStarted, setCallStarted] = useState(false);
    const [callDuration, setCallDuration] = useState(0);


    return (
        
        <DashboardLayout>
            <DashboardNavbar />

            {call.isReceivingCall && !callAccepted && (
                <>
                    <h1>Người với định danh {call.name} đang gọi cho bạn</h1>
                    <button onClick={answerCall}> Nhận cuộc gọi </button>
                </>
            )}

            {stream && (
                // <video playsInline muted ref={myVideo} autoPlay />
                <video playsInline muted ref={myVideo} autoPlay />
            )}

            {callAccepted && !callEnded && (
                <video playsInline ref={userVideo} autoPlay />
            )}

            <div style={{
                margin: 0,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
            }}>
                <input placeholder="Nhập uuid của người dùng để gọi" style={{padding: 10, width: "400px", borderColor: "blueviolet"}} onChange={(e) => setIdToCall(e.target.value)}/>
                <button style={{padding: 10}}
                    onClick={() => callUser(idToCall)}
                >
                    Gọi
                </button>

                <h1>Uuid của tôi là: {myself.uuid}</h1>

            </div>

            <SoftBox py={3}>
                <h1>This is plain theme</h1>
            </SoftBox>

            <Footer />
        </DashboardLayout>

    );
}

export default Calling;
