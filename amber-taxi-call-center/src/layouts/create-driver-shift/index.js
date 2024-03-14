// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";

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
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

// Antd
import { Steps, Button, Table, Flex, DatePicker, Form, TimePicker, message } from 'antd';

//
import { beAPI } from "api";



function CreateDriverShift() {
  
  // Biếu form dùng cho lấy dữ liệu từ form
  const [createDriverShiftForm] = Form.useForm();

  // Biến cho tài xế được chọn trong bảng
  const [selectedRowKeysDriverTable, setSelectedRowKeysDriverTable] = useState([]);
  const [selectedRowKeysCarTable, setSelectedRowKeysCarTable] = useState([]);

  const [dataDriverTable, setDataDriverTable] = useState([]);
  const [dataCarTable, setDataCarTable] = useState([]);

  // Biến messageApi để dùng hiển thị kết quả thực thi
  const [messageApi, contextHolder] = message.useMessage();

  // 
  const onSelectChangeDriverTable = (newSelectedRowKeys) => {
    //console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeysDriverTable(newSelectedRowKeys);
  };

  // 
  const rowSelectionDriverTable = {
    selectedRowKeysDriverTable,
    onChange: onSelectChangeDriverTable,
    type: "radio"
  };

  // 
  const onSelectChangeCarTable = (newSelectedRowKeys) => {
    //console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeysCarTable(newSelectedRowKeys);
  };

  // 
  const rowSelectionCarTable = {
    selectedRowKeysCarTable,
    onChange: onSelectChangeCarTable,
    type: "radio"
  };


    
  const columnDriverTable = [
    {
      title: 'Tên',
      dataIndex: 'fullName',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
    },
    {
      title: 'Căn cước công dân',
      dataIndex: 'cic',
    },
    {
      title: 'Bằng lái xe',
      dataIndex: 'drivingLicenceNumber',
    },
  ];

  const columnCarTable = [
    {
      title: 'Tên model',
      dataIndex: 'modelName',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Số chỗ',
      dataIndex: 'seat',
    },
    {
      title: 'Màu sắc',
      dataIndex: 'color',
    },
    {
      title: 'Biển số xe',
      dataIndex: 'licensePlate',
    },
  ]


  const getDriverList = async () => {
    let responseDriverData = await beAPI.get(`/driver`);
    let driverList = responseDriverData.data.data;
    let driverTable = [];

    driverList.forEach( item => {
      driverTable.push({
        key: item.userId,
        uuid: item.userId,
        fullName: item.user.fullName,
        phone: item.user.phone,
        cic: item.user.cic,
        drivingLicenceNumber: item.drivingLicenceNumber
      });

    })

    if( JSON.stringify(driverTable) != JSON.stringify(dataDriverTable) ){
      setDataDriverTable( [...driverTable] );
    }
  }

  const getCarList = async () => {
    let responseCarData = await beAPI.get(`/car`);
    let carList = responseCarData.data.data;
    let carTable = [];

    carList.forEach(item => {
      
      carTable.push({
        key: item.uuid,
        uuid: item.uuid,
        modelName: item.modelName,
        seat: item.seat,
        color: item.color,
        licensePlate: item.licensePlate
      });

    });

    if( JSON.stringify(carTable) != JSON.stringify(dataCarTable) ){
      setDataCarTable( [...carTable] );
    }
  }

  getDriverList();
  getCarList();

  const submitDriverShift = async () => {
    if (selectedRowKeysDriverTable && selectedRowKeysCarTable && createDriverShiftForm.getFieldValue("driver-shift-range-time-picker")[0] && createDriverShiftForm.getFieldValue("driver-shift-range-time-picker")[1]){
      let driverSelected = dataDriverTable.find(item => { 
        if (item.key == selectedRowKeysDriverTable[0]) {
          return true;
        }
        return false;
      })

      let carSelected = dataCarTable.find(item => { 
        if (item.key == selectedRowKeysCarTable[0]) {
          return true;
        }
        return false;
      })

      let drivershift = {
        driverId: driverSelected.uuid,
        carId: carSelected.uuid,
        shiftStartTime: createDriverShiftForm.getFieldValue("driver-shift-range-time-picker")[0],
        shiftEndTime: createDriverShiftForm.getFieldValue("driver-shift-range-time-picker")[1]
      }

      // Lấu drivershift mới nhất để kiểm tra hợp lệ
      let responseDrivershiftLatestData =  await beAPI.get(`/drivershift/getLatestDrivershift/${drivershift.uuid}`);
      if ( responseDrivershiftLatestData.status != 200 ){
        messageApi.open({
          type: 'error',
          content: 'Không thể tạo ca làm',
        });
        return;
      }
      
      if ( new Date < new Date( responseDrivershiftLatestData.data.data.shiftEndTime ) ){
        messageApi.open({
          type: 'warning',
          content: 'Người dùng có ca làm chưa kết thúc',
        });
        return;
      } 
      else{
        let responseDrivershiftData = await beAPI.post('/drivershift', drivershift);
        if ( responseDrivershiftData.status != 201 ){
          messageApi.open({
            type: 'error',
            content: 'Không thể tạo ca làm',
          });
          return;
        }
  
        if( responseDrivershiftData.status == 201 ){
          messageApi.open({
            type: 'success',
            content: 'Tạo ca làm thành công, reload trong 2s',
          });
    
          // Chờ 2s để điều hướng
          setTimeout(() => {
              
            // Điều hướng đến trang chi tiết chuyến đi
            window.location.href = `/create-driver-shift`;
    
          }, 2000);
        }
      }
    }

  }

  return (
    <>
      {contextHolder}

      <DashboardLayout>
        <DashboardNavbar />

          <SoftBox py={3}>

            <Card>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                  <SoftBox p={2}>

                    <h3>Tài xế</h3>

                    <div
                      style={{
                        marginBottom: 16,
                      }}
                    ></div>

                    <Table size='small' rowSelection={rowSelectionDriverTable}
                      columns={columnDriverTable}
                      dataSource={dataDriverTable}
                    />

                  </SoftBox>
                </Grid>

                <Grid item xs={12} lg={6}>
                  <SoftBox p={2}>
                      
                    <h3>Phương tiện</h3>

                    <div
                      style={{
                        marginBottom: 16,
                      }}
                    ></div>

                    <Table size='small' rowSelection={rowSelectionCarTable}
                      columns={columnCarTable}
                      dataSource={dataCarTable}
                    />
                  </SoftBox>
                </Grid>

                <Grid item xs={12} lg={12}>
                  <SoftBox p={2}>
                    
                    <h3>Ca làm</h3>

                    <Form layout="inline" form={createDriverShiftForm}>

                      <Form.Item name="driver-shift-range-time-picker" label="Thời gian ca làm" rules={[{type: "array"}]} >
                        <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
                      </Form.Item>

                      <Form.Item>
                        <Button onClick={submitDriverShift} type="primary">Tạo ca làm</Button>
                      </Form.Item>

                    </Form>

                  </SoftBox>
                </Grid>

              </Grid>
            </Card>

          </SoftBox>

        <Footer />
      </DashboardLayout>
    </>
    
  );
}

export default CreateDriverShift;
