import RatingController from '../controllers/RatingController';

const express = require('express');
const Router = express.Router();


//Router không lấy dữ liệu req không chỉnh sửa res chỉ thêm middleware để xử lý

Router.get('/', async (req, res) => {
    await RatingController.getAll(req, res);
});

Router.get('/:uuid', async (req, res) => {
    await RatingController.getByUuid(req, res);
});

Router.get('/getAllByDriverId/:driverId', async (req, res) => {
    await RatingController.getAllByDriverId(req, res);
});

Router.get('/getDriverRatingByDriverId/:driverId', async (req, res) => {
    await RatingController.getDriverRatingByDriverId(req, res);
});

Router.get('/getByRideId/:rideId', async (req, res) => {
    await RatingController.getByRideId(req, res);
});

Router.post('/', async (req, res) => {
    await RatingController.insert(req, res);
});

module.exports = Router;