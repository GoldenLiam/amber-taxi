import RidestatusController from '../controllers/RidestatusController';

const express = require('express');
const Router = express.Router();


//Router không lấy dữ liệu req không chỉnh sửa res chỉ thêm middleware để xử lý

Router.get('/', async (req, res) => {
    await RidestatusController.getAll(req, res);
});

Router.get('/getAllWithRide', async (req, res) => {
    await RidestatusController.getAllWithRide(req, res);
});

Router.get('/:uuid', async (req, res) => {
    await RidestatusController.getByUuid(req, res);
});

Router.get('/rideId/:rideId', async (req, res) => {
    await RidestatusController.getByRideId(req, res);
});

Router.get('/getAllByRideId/:rideId', async (req, res) => {
    await RidestatusController.getAllByRideId(req, res);
});

Router.post('/', async (req, res) => {
    await RidestatusController.insert(req, res);
});

module.exports = Router;