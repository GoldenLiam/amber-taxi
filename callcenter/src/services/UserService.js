import axios from "axios"

axios.defaults.withCredentials = true
export const loginUser = async (email, password) => {
    let data = { email, password }
    const res = await axios.post(`http://localhost:3001/api/user/login`, data)
    return res.data
}

export const logoutUser = async () => {
    const res = await axios.post(`http://localhost:3001/api/user/logout`)
    return res.data
}

export const refreshToken = async () => {
    const res = await axios.post(`http://localhost:3001/user/refresh-token`, {
        // withCredentials: true
    })
    return res.data
}

export const verifyUser = async () => {
    const res = await axios.get(`http://localhost:3001/api/user`)
    return res.data
}

export const getCustomerInfo = async () => {
    const res = await axios.get(`http://localhost:3001/api/user/customer`)
    return res.data
}