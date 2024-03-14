import LeftSideNavBar from "../../components/LeftSideNavBar/LeftSideNavBar"
import TopNavBar from "../../components/TopNavBar/TopNavBar"
import CallingPage from "./CallingPage";
import { PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';

const ContactPage = () => {

    const onChange = (key) => {
        console.log(key);
    };

    const items = [
        {
            key: '1',

            label:      <span>
                            &nbsp;&nbsp;&nbsp;<PhoneOutlined style={{ fontSize: '25px' }} />
                        </span>,

            children:   <>
                            <CallingPage />
                        </>,
        },
        {
            key: '2',

            label:      <span>
                            &nbsp;&nbsp;&nbsp;<UserOutlined style={{ fontSize: '25px' }} />
                        </span>,

            children: 'Content of Tab Pane 2',
        }
    ];

    return (
        <>
            <div id="wrapper">
                <LeftSideNavBar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <TopNavBar />
                        <div style={{ padding: '0px 20px 0 20px' }}>
                            {/* <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Liên hệ</h1>
                            </div> */}
                            <Tabs
                                defaultActiveKey="1"
                                items={items}
                                onChange={onChange}
                                indicatorSize={(origin) => origin - 16}
                                centered
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContactPage