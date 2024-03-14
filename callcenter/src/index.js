import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

//Thu vien boostrap
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.min';

//Note
/*
https://react-bootstrap-v4.netlify.app/components/alerts/  (component trong boostrap 4 react)
https://react-chartjs-2.js.org/ (cho bản đồ)
*/

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
