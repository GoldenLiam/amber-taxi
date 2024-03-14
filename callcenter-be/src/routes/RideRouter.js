const express = require('express')
const router = express.Router()
const RideController = require('../controller/RideController')

router.post('/create-ride', RideController.createRide)
router.get('/get-earnings-overview', RideController.getEarnings)
router.get('/get-card-statistics', RideController.getCardStatistics)

module.exports = router