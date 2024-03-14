import { useNavigate } from "react-router-dom";

const LeftSideNavBar = () => {
    const navigate = useNavigate()
    const handleNavigateContact = () => {
        window.location.assign('/contact');
    }
    return (
        <>
            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                <div className="sidebar-brand d-flex align-items-center justify-content-center" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    {/* <div className="sidebar-brand-icon rotate-n-15">
                        <i className="fas fa-laugh-wink"></i>
                    </div> */}
                    <div className="sidebar-brand-text mx-3">FIS Call Center</div>
                </div>

                <hr className="sidebar-divider my-0" />
                <li className="nav-item">
                    <div className="nav-link" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <i className="fas fa-fw fa-tachometer-alt"></i>
                        <span>Dashboard</span>
                    </div>
                </li>
                <li className="nav-item">
                    <div className="nav-link" onClick={handleNavigateContact} style={{ cursor: 'pointer' }}>
                        <i className="fas fa-fw fa-address-book"></i>
                        <span>Liên hệ</span>
                    </div>
                </li>
                <li className="nav-item">
                    <div className="nav-link" onClick={() => navigate('/customer')} style={{ cursor: 'pointer' }}>
                        <i className="fas fa-fw fa-history"></i>
                        <span>Lịch sử tạo cuốc</span>
                    </div>
                </li>
                <li className="nav-item">
                    <div className="nav-link" onClick={() => navigate('/driver')} style={{ cursor: 'pointer' }}>
                        <i className="fas fa-fw fa-car-alt"></i>
                        <span>Tài xế</span>
                    </div>
                </li>
                <li className="nav-item">
                    <div className="nav-link" onClick={() => navigate('/statistics')} style={{ cursor: 'pointer' }}>
                        <i className="fas fa-fw fa-receipt"></i>
                        <span>Thống kê</span>
                    </div>
                </li>

                <hr className="sidebar-divider" />

            </ul>
        </>
    );
}


export default LeftSideNavBar;