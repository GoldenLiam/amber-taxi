import { ScreenDevices } from '../../constants';

function MapOverlay() {
    return (
        <div style={{position: 'absolute', zIndex: 999}}>
            
            { (ScreenDevices().isMobileDevice) && 
                <div style={{ left: "72%" }}>

                    <div style={{left: "40%", position: "relative", marginTop: "100px"}} className="d-flex flex-column align-items-center">
                        <img style={{
                            height: "70px",
                            width: "70px",
                        }}
                        className="rounded-circle img-thumbnail"
                        src="https://i.pinimg.com/originals/e6/07/a9/e607a9f494d1c111d2fc5922b2ffed24.png" />

                        <div style={{
                            background: "white",
                            height: "20px",
                            width: "50px",
                            textTransform: "uppercase",
                            lineHeight: "16px",
                            border: "2px solid #F37021",
                            fontFamily: "'Roboto', sans-serif",
                            fontSize: "12px",
                            textShadow: "1px 0 0 rgba(0,0,0,0.2)",
                            marginTop: "-15px"
                        }} className="text-center rounded-pill">
                            <i className="bi bi-star-fill text-warning"></i> 5.0
                        </div>

                        <button type="button" className="btn btn-outline-light rounded" 
                            style={{
                                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                                marginTop: "325px"
                            }}>
                                
                            <div style={{
                                backgroundImage: `url('https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png')`, 
                                width: "18px", 
                                height: "18px",
                                backgroundPositionX: 18,
                                backgroundPositionY: 0,
                            }}>
                            </div>
                        </button>

                    </div>

                </div>
            }


            { (ScreenDevices().isLaptop || ScreenDevices().isDesktop || ScreenDevices().isBigScreen) && 
                <div style={{ left: "90%" }}>

                    <div style={{left: "40%", position: "relative", marginTop: "100px"}} className="d-flex flex-column align-items-center">
                        <img style={{
                            height: "70px",
                            width: "70px",
                        }}
                        className="rounded-circle img-thumbnail"
                        src="https://i.pinimg.com/originals/e6/07/a9/e607a9f494d1c111d2fc5922b2ffed24.png" />

                        <div style={{
                            background: "white",
                            height: "20px",
                            width: "50px",
                            textTransform: "uppercase",
                            lineHeight: "16px",
                            border: "2px solid #F37021",
                            fontFamily: "'Roboto', sans-serif",
                            fontSize: "12px",
                            textShadow: "1px 0 0 rgba(0,0,0,0.2)",
                            marginTop: "-15px"
                        }} className="text-center rounded-pill">
                            <i className="bi bi-star-fill text-warning"></i> 5.0
                        </div>

                        <button type="button" className="btn btn-outline-light rounded" 
                            style={{
                                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                                marginTop: "325px"
                            }}>
                                
                            <div style={{
                                backgroundImage: `url('https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png')`, 
                                width: "18px", 
                                height: "18px",
                                backgroundPositionX: 18,
                                backgroundPositionY: 0,
                            }}>
                            </div>
                        </button>

                    </div>

                </div>
            }

        </div>
    )
}

export default MapOverlay;
