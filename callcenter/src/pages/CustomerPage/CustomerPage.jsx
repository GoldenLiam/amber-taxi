import React, { useEffect, useState } from 'react';
import { Input, Table } from 'antd';
import { getCustomerInfo } from '../../services/UserService';
import { convertDBDateToTableDate } from '../../utils/HandleDateTime';
import LeftSideNavBar from '../../components/LeftSideNavBar/LeftSideNavBar';
// Css của trang home
import '../../assets/css/sb-admin-2.min.css';
import '../../assets/vendor/fontawesome-free/css/all.min.css';
import TopNavBar from '../../components/TopNavBar/TopNavBar';

const CustomerPage = () => {
    const [searchText, setSearchText] = useState('');
    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const getColumnSearchProps = (dataIndex) => ({
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        filteredValue: searchText ? [searchText] : [],
    });


    const columns = [
        {
            title: 'Tên',
            width: 200,
            dataIndex: 'customerName',
            key: 'customerName',
            fixed: 'left',
            onFilter: (value, record) => record.customerName.indexOf(value) === 0,
            sorter: (a, b) => a.customerName.length - b.customerName.length,
            sortDirections: ['descend'],
        },
        {
            title: 'Điện thoại',
            width: 120,
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            fixed: 'left',
            ...getColumnSearchProps('phoneNumber'),
        },
        {
            title: 'Ngày bắt đầu',
            width: 120,
            dataIndex: 'startDate',
            key: '1',
            sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
        },
        {
            title: 'Thời gian bắt đầu',
            width: 120,
            dataIndex: 'startTime',
            key: '2',
            // sorter: (a, b) => a.startTime - b.startTime,
        },
        {
            title: 'Hẹn giờ',
            width: 80,
            dataIndex: 'appointment',
            key: '3',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.appointment - b.appointment,
        },
        {
            title: 'Điểm bắt đầu',
            width: 200,
            dataIndex: 'addressStartingPoint',
            key: '4',
        },
        {
            title: 'Điểm đến',
            width: 200,
            dataIndex: 'addressDestinationPoint',
            key: '5',
        },
        {
            title: 'Quãng đường (km)',
            width: 120,
            dataIndex: 'distance',
            key: '6',
        },
        {
            title: 'Thành tiền (VNĐ)',
            width: 120,
            dataIndex: 'price',
            key: '7',
        },
        // {
        //     title: 'Tùy chọn',
        //     key: 'operation',
        //     fixed: 'right',
        //     width: 100,
        //     render: () => <a>Xóa</a>,
        // },
    ];
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 4,
    });

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
        setPagination(pagination);
    };

    useEffect(() => {
        const fetchData = async () => {
            const res = await getCustomerInfo();
            console.log(res.data)
            if (res.status === 'OK') {


                res.data.forEach((element, i) => {
                    res.data[i].startDate = convertDBDateToTableDate(res.data[i].startDate);
                    res.data[i].key = res.data[i].uuid
                });

                //res.data.startDate = convertDBDateToTableDate( res.data.startDate );
                setData(res.data);
            }
        };
        fetchData();
    }, []);
    return (
        <>
            <div id="wrapper">
                <LeftSideNavBar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <TopNavBar />
                        <div style={{ padding: '0px 20px 0 20px' }}>
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Lịch sử tạo cuốc</h1>
                            </div>
                            <Input
                                type="text"
                                placeholder="Tìm kiếm bằng số điện thoại..."
                                value={searchText}
                                onChange={handleSearch}
                                style={{ marginBottom: '10px', width: '25%' }}
                            />
                            <Table
                                columns={columns}
                                dataSource={data}
                                scroll={{
                                    x: 1300,
                                }}
                                onChange={onChange}
                                pagination={pagination}
                                bordered
                                searchText={searchText}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CustomerPage