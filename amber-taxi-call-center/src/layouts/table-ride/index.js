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

// React
import React, { useEffect, useRef, useState } from 'react';

// Antd
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Card, Tag } from 'antd';
import Highlighter from 'react-highlight-words';

// Api
import { beAPI } from "api";
import { handlingDateTime } from "utils";


function TableRide() {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [ridestatusList, setRidestatusList] = useState([]);

    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                        width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                        width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                        confirm({
                            closeDropdown: false,
                        });
                        setSearchText(selectedKeys[0]);
                        setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                        close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),

        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },

        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                highlightStyle={{
                    backgroundColor: '#ffc069',
                    padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'UUID',
            dataIndex: 'uuid',
            key: 'uuid',
            width: '5%',
            ...getColumnSearchProps('uuid'),
            render: (text) => <a href={"/ride-detail/" + text}>{text}</a>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'state',
            key: 'state',
            width: '15%',
            ...getColumnSearchProps('state'),
            sorter: (a, b) => a.address.length - b.address.length,
            sortDirections: ['descend', 'ascend'],
            render: (text) => 
                <>
                    {text == "DONE" && 
                    <Tag bordered={false} color="success">
                        Hoàn thành
                    </Tag>
                    }
                    
                    {text == "PICKED" && 
                    <Tag bordered={false} color="processing">
                        Đã đón
                    </Tag>}

                    {text == "DENIED" && 
                    <Tag bordered={false} color="warning">
                        Hủy đón
                    </Tag>}
                    
                    {text == "ACCEPTED" && 
                    <Tag bordered={false} color="purple">
                        Đã nhận
                    </Tag>}
                    
                    {text == "CANCELED" && 
                    <Tag bordered={false} color="error">
                        Bị hủy
                    </Tag>}

                    {text == "CREATED" && 
                    <Tag bordered={false} color="magenta">
                        Đã tạo
                    </Tag>}
                </>
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'fullName',
            key: 'fullName',
            ...getColumnSearchProps('fullName'),
            sorter: (a, b) => a.address.length - b.address.length,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Điểm đón',
            dataIndex: 'startingPoint',
            key: 'startingPoint',
            ...getColumnSearchProps('startingPoint'),
        },
        {
            title: 'Điểm đến',
            dataIndex: 'destinationPoint',
            key: 'destinationPoint',
            ...getColumnSearchProps('destinationPoint'),
        },
    ];

    const getRidestatusList = async () => {
        let ridestatusListDataResponse = await beAPI.get("/ridestatus/getAllWithRide");
        if( ridestatusListDataResponse.status == 200){
            let ridestatusListData = [];
            ridestatusListDataResponse.data.data.forEach(ridestatus => {
                // Tìm ridestatus đã có chưa để thêm vào table (chưa mới thêm vào)
                let findRidestatus = ridestatusListData.find(item => {
                    if (item.rideId == ridestatus.rideId){
                        return true;
                    }
                    return false;
                })


                if( findRidestatus == undefined || findRidestatus == null ){
                    ridestatusListData.push({
                        key: ridestatus.uuid,
                        uuid: ridestatus.rideId, //note
                        rideId: ridestatus.rideId,
                        state: ridestatus.state,
                        fullName: ridestatus.ride.fullName,
                        phone: ridestatus.ride.phone,
                        startingPoint: ridestatus.ride.startingPoint.split(";")[2],
                        destinationPoint: ridestatus.ride.destinationPoint.split(";")[2]
                    });
                }

            });
            
            if (JSON.stringify(ridestatusList) != JSON.stringify(ridestatusListData)){
                setRidestatusList(ridestatusListData);
            }
        }

    }

    useEffect(() => {
        getRidestatusList();
    }, [])

    return (
        <DashboardLayout>
            <DashboardNavbar />

            <SoftBox mb={3}>
                <Card>
                    <SoftBox py={2}>
                        <h3>Danh sách cuốc xe</h3>

                        <Table columns={columns} dataSource={ridestatusList} />
                    </SoftBox>
                </Card>
            </SoftBox>


            <Footer />
        </DashboardLayout>
    );
}

export default TableRide;
