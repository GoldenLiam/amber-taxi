const express = require('express')
const router = express.Router()
const UserController = require('../controller/UserController')
const { authMiddleware } = require('../middleware/authMiddleware')


router.post('/login', UserController.loginUser)
router.post('/refresh-token', UserController.refreshToken)
router.post('/logout', UserController.logoutUser)
router.get('/', UserController.verifyUser)
router.get('/customer', UserController.getCustomerInfo)
// router.delete('/delete-customer/:uuid', UserController.deleteCustomer)

module.exports = router