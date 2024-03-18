import MessageController from '../controllers/MessageController';

const express = require('express');
const Router = express.Router();


//Router không lấy dữ liệu req không chỉnh sửa res chỉ thêm middleware để xử lý

Router.get('/', async (req, res) => {
    await MessageController.getAll(req, res);
});

Router.get('/:uuid', async (req, res) => {
    await MessageController.getByUuid(req, res);
});

Router.get('/getAllByRideId/:rideId', async (req, res) => {
    await MessageController.getAllByRideId(req, res);
});

Router.post('/', async (req, res) => {
    await MessageController.insert(req, res);
});

module.exports = Router;