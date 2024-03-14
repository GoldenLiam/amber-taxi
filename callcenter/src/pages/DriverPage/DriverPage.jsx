import LeftSideNavBar from "../../components/LeftSideNavBar/LeftSideNavBar"
import TopNavBar from "../../components/TopNavBar/TopNavBar"

const DriverPage = () => {
    return (
        <>
            <div id="wrapper">
                <LeftSideNavBar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <TopNavBar />
                        <div style={{ padding: '0px 20px 0 20px' }}>
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Tài xế</h1>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default DriverPage