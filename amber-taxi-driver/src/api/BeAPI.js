import axios from "axios";

//https://blog.logrocket.com/how-to-make-http-requests-like-a-pro-with-axios/#axiospost
//https://www.upbeatcode.com/react/clean-api-architecture-for-react-project/

const beAPI = axios.create({
    baseURL: 'http://localhost:9000/api/',
    timeout: 10000,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': '*'
    }
});

export default beAPI;