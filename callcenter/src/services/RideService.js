import axios from "axios"

axios.defaults.withCredentials = true
export const createRide = async (data) => {
    // console.log(data)
    const res = await axios.post(`http://localhost:3001/api/ride/create-ride`, {data})
    return res.data
}

export const getEarningsOverview = async () => {
    const res = await axios.get(`http://localhost:3001/api/ride/get-earnings-overview`)
    return res.data
}

export const getCardStatistics = async () => {
    const res = await axios.get(`http://localhost:3001/api/ride/get-card-statistics`)
    return res.data
}
