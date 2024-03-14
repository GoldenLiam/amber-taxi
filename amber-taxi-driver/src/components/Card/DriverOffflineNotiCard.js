import Card from 'react-bootstrap/Card';
import React, { useEffect, useState, createContext, useContext } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { goOffline, goOnline, selectDriverState } from "../../redux";


function DriverStatusCard(props) {
  let dispatch = useDispatch();

  return (
    <Card.Body style={{height: 55}}>
      <div className='d-flex justify-content-evenly align-items-center'>

        <i className="bi bi-dot" style={{ fontSize: 25, color: 'gray' }}></i>

        <div style={{ fontSize: 15 }}>
          Bạn đang không sẵn sàng nhận cuốc
        </div>

        <span className="btn btn-sm btn-outline-dark rounded-circle" onClick={() => dispatch(goOnline())} >
          <i className="bi bi-power" style={{ fontSize: 15 }}></i>
        </span>

      </div>
    </Card.Body>
  );
}

export default DriverStatusCard;