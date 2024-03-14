const RideService = require('../services/RideService')

const createRide = async (req, res) => {
    try {
        const { customerName, phoneNumber, startDate, startTime, appointment, addressStartingPoint, addressDestinationPoint, distance, price } = req.body.data
        if (!customerName || !phoneNumber || !startDate || !startTime || appointment===null || !addressStartingPoint || !addressDestinationPoint || !distance || !price) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await RideService.createRide(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }
}

const getEarnings = async (req, res) => {
    try {
        const response = await RideService.getEarningsOverview()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getCardStatistics = async (req, res) => {
    try {
        const response = await RideService.getCardStatistics()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createRide,
    getEarnings,
    getCardStatistics,
}

