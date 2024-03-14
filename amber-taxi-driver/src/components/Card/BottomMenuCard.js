import Card from 'react-bootstrap/Card';
import { ScreenDevices } from '../../constants';
import { useSelector, useDispatch } from 'react-redux';
import { goOffline, goOnline, selectDriverState } from "../../redux";


function BottomMenuCard() {
  let driverStates = useSelector(selectDriverState);
  let dispatch = useDispatch();
  
  return (
    <>
      <Card>
        <Card.Body className='row'>

          { (ScreenDevices().isMobileDevice) && 
            <>
              <div className='col-3 d-flex flex-column align-items-center'>
                <div>
                  <button style={{boxShadow: `rgba(0, 0, 0, 0.24) 0px 3px 8px`}} type="button" className="btn btn-sm btn-outline-primary rounded-circle">
                    <i className="bi bi-ui-checks" style={{ fontSize: 20 }}></i>
                  </button>
                </div>

                <div>
                  <small style={{ fontSize: 7 }}>Tìm cuốc</small>
                </div>
              </div>


              <div className='col-3 d-flex flex-column align-items-center'>
                <div>
                  <button style={{boxShadow: `rgba(0, 0, 0, 0.24) 0px 3px 8px`}} type="button" className="btn btn-sm btn-outline-primary rounded-circle">
                    <i className="bi bi-geo-alt" style={{ fontSize: 20 }}></i>
                  </button>
                </div>

                <div>
                  <small style={{ fontSize: 7 }}>Điểm đến yêu thích</small>
                </div>
              </div>

              
              <div className='col-3 d-flex flex-column align-items-center'>
                <div>
                  <button style={{boxShadow: `rgba(0, 0, 0, 0.24) 0px 3px 8px`}} type="button" className="btn btn-sm btn-outline-primary rounded-circle">
                    <i className="bi bi-shield-shaded" style={{ fontSize: 20 }}></i>
                  </button>
                </div>

                <div>
                  <small style={{ fontSize: 7 }}>Trung tâm hỗ trợ</small>
                </div>
              </div>


              {driverStates.currentState === 'offline' && 
                <div className='col-3 d-flex flex-column align-items-center'>
                  <div>
                    <button onClick={() => dispatch(goOnline())} style={{boxShadow: `rgba(0, 0, 0, 0.24) 0px 3px 8px`}} type="button" className="btn btn-sm btn-outline-dark rounded-circle">
                      <i className="bi bi-power" style={{ fontSize: 20 }}></i>
                    </button>
                  </div>

                  <div>
                    <small style={{ fontSize: 7 }}>Đang offline</small>
                  </div>
                </div>
              }

              {driverStates.currentState === 'online' && 
                <div className='col-3 d-flex flex-column align-items-center'>
                  <div>
                    <button onClick={() => dispatch(goOffline())} style={{boxShadow: `rgba(0, 0, 0, 0.24) 0px 3px 8px`}} type="button" className="btn btn-sm btn-success rounded-circle">
                      <i className="bi bi-ev-front" style={{ fontSize: 20 }}></i>
                    </button>
                  </div>

                  <div>
                    <small style={{ fontSize: 7 }}>Đang online</small>
                  </div>
                </div>
              }
            </>
          }

          { (ScreenDevices().isLaptop || ScreenDevices().isDesktop || ScreenDevices().isBigScreen) && 
            <>
              <div className='col-3 d-flex flex-column align-items-center'>
                <div>
                  <button style={{boxShadow: `rgba(0, 0, 0, 0.24) 0px 3px 8px`}} type="button" className="btn btn-sm btn-outline-primary rounded-circle">
                    <i className="bi bi-ui-checks" style={{ fontSize: 20 }}></i>
                  </button>
                </div>

                <div>
                  <small style={{ fontSize: 10 }}>Tìm cuốc</small>
                </div>
              </div>


              <div className='col-3 d-flex flex-column align-items-center'>
                <div>
                  <button style={{boxShadow: `rgba(0, 0, 0, 0.24) 0px 3px 8px`}} type="button" className="btn btn-sm btn-outline-primary rounded-circle">
                    <i className="bi bi-geo-alt" style={{ fontSize: 20 }}></i>
                  </button>
                </div>

                <div>
                  <small style={{ fontSize: 10 }}>Điểm đến yêu thích</small>
                </div>
              </div>

              
              <div className='col-3 d-flex flex-column align-items-center'>
                <div>
                  <button style={{boxShadow: `rgba(0, 0, 0, 0.24) 0px 3px 8px`}} type="button" className="btn btn-sm btn-outline-primary rounded-circle">
                    <i className="bi bi-shield-shaded" style={{ fontSize: 20 }}></i>
                  </button>
                </div>

                <div>
                  <small style={{ fontSize: 10 }}>Trung tâm hỗ trợ</small>
                </div>
              </div>

              {driverStates.currentState === 'offline' && 
                <div className='col-3 d-flex flex-column align-items-center'>
                  <div>
                    <button onClick={() => dispatch(goOnline())} style={{boxShadow: `rgba(0, 0, 0, 0.24) 0px 3px 8px`}} type="button" className="btn btn-sm btn-outline-dark rounded-circle">
                      <i className="bi bi-power" style={{ fontSize: 20 }}></i>
                    </button>
                  </div>

                  <div>
                    <small style={{ fontSize: 10 }}>Đang offline</small>
                  </div>
                </div>
              }

              {driverStates.currentState === 'online' && 
                <div className='col-3 d-flex flex-column align-items-center'>
                  <div>
                    <button onClick={() => dispatch(goOffline())} style={{boxShadow: `rgba(0, 0, 0, 0.24) 0px 3px 8px`}} type="button" className="btn btn-sm btn-success rounded-circle">
                      <i className="bi bi-ev-front" style={{ fontSize: 20 }}></i>
                    </button>
                  </div>

                  <div>
                    <small style={{ fontSize: 10 }}>Đang online</small>
                  </div>
                </div>
              }

            </>
          }

        </Card.Body>
      </Card>
    </>
    
  );
}

export default BottomMenuCard;


/*
import Card from 'react-bootstrap/Card';
import Offcanvas from 'react-bootstrap/Offcanvas';


function BottomMenuCard() {
  return (
    <Card>
        <Card.Body className='d-flex justify-content-evenly'>

        <div className='d-flex flex-column align-items-center'>
          <div>
            <button type="button" className="btn btn-sm btn-outline-primary rounded-circle">
              <i className="bi bi-ui-checks" style={{ fontSize: 20 }}></i>
            </button>
          </div>

          <div>
            <small style={{ fontSize: 10 }}>Tìm cuốc</small>
          </div>
        </div>

        <div className='d-flex flex-column align-items-center'>
          <div>
            <button type="button" className="btn btn-sm btn-outline-primary rounded-circle">
              <i className="bi bi-geo-alt" style={{ fontSize: 20 }}></i>
            </button>
          </div>

          <div>
            <small style={{ fontSize: 10, width: 10 }}>Điểm đến yêu thích</small>
          </div>
        </div>

        <div className='d-flex flex-column align-items-center'>
          <div>
            <button type="button" className="btn btn-sm btn-outline-primary rounded-circle">
              <i className="bi bi-car-front" style={{ fontSize: 20 }}></i>
            </button>
          </div>

          <div>
              <small style={{ fontSize: 10, 
              textOverflow: 'ellipsis',
              overflow: 'hidden', 
              width: '100px' ,
              whiteSpace: 'nowrap' }}>Thông tin chuyến đi</small>
            </div>
          </div>

        <div className='d-flex flex-column align-items-center'>
          <div>
            <button type="button" className="btn btn-sm btn-outline-primary rounded-circle">
              <i className="bi bi-shield-shaded" style={{ fontSize: 20 }}></i>
            </button>
          </div>

          <div>
            <small style={{ fontSize: 10, width: 10 }}>Trợ giúp</small>
          </div>
        </div>

      
        <div className='d-flex flex-column align-items-center'>
          <div>
            <button type="button" className="btn btn-sm btn-outline-dark rounded-circle">
              <i className="bi bi-power" style={{ fontSize: 20 }}></i>
            </button>
          </div>

          <div>
            <small style={{ fontSize: 10 }}>Đang offline</small>
          </div>
        </div>

        

        </Card.Body>
    </Card>
  );
}

export default BottomMenuCard;
*/