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
import { Button, Input, Space, Table, Card } from 'antd';
import Highlighter from 'react-highlight-words';

// Api
import { beAPI } from "api";
import { handlingDateTime } from "utils";

const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Joe Black',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Jim Green',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Jim Red',
      age: 32,
      address: 'London No. 2 Lake Park',
    },
];


function TableDriverShift() {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [drivershiftList, setDrivershiftList] = useState([]);

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
            title: 'Tên tài xế',
            dataIndex: 'fullName',
            key: 'fullName',
            width: '25%',
            ...getColumnSearchProps('fullName'),
        },
        {
            title: 'Thời gian',
            dataIndex: 'startendTime',
            key: 'startendTime',
            width: '40%',
            ...getColumnSearchProps('startendTime'),
        },
        {
            title: 'Model xe',
            dataIndex: 'modelName',
            key: 'modelName',
            ...getColumnSearchProps('modelName'),
            sorter: (a, b) => a.address.length - b.address.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Biển số xe',
            dataIndex: 'licensePlate',
            key: 'licensePlate',
            ...getColumnSearchProps('licensePlate'),
            sorter: (a, b) => a.address.length - b.address.length,
            sortDirections: ['descend', 'ascend'],
        },
    ];

    const getDrivershiftList = async () => {
        let drivershiftListDataResponse = await beAPI.get("/drivershift/getAllWithDriverCar");
        if( drivershiftListDataResponse.status == 200){
            let drivershiftListData = [];
            drivershiftListDataResponse.data.data.forEach(drivershift => {
                drivershiftListData.push({
                    key: drivershift.uuid,
                    uuid: drivershift.uuid,
                    fullName: drivershift.user.fullName,
                    startendTime: `${handlingDateTime.convertISODateStringToDMYHMSTimeFormat(drivershift.shiftStartTime)} - ${handlingDateTime.convertISODateStringToDMYHMSTimeFormat(drivershift.shiftEndTime)}`,
                    modelName: drivershift.car.modelName,
                    licensePlate: drivershift.car.licensePlate
                })
            });
            
            if (JSON.stringify(drivershiftListData) != JSON.stringify(drivershiftList)){
                setDrivershiftList(drivershiftListData);
            }
        }

    }

    useEffect(() => {
        getDrivershiftList();
    }, [])

    return (
        <DashboardLayout>
            <DashboardNavbar />

            <SoftBox mb={3}>
                <Card>
                    <SoftBox py={2}>
                        <h3>Danh sách ca làm</h3>
                        <br/>
                        <Table columns={columns} dataSource={drivershiftList} />
                    </SoftBox>
                </Card>
            </SoftBox>


            <Footer />
        </DashboardLayout>
    );
}

export default TableDriverShift;
