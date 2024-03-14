import RideController from '../controllers/RideController';

const express = require('express');
const Router = express.Router();


//Router không lấy dữ liệu req không chỉnh sửa res chỉ thêm middleware để xử lý

Router.get('/', async (req, res) => {
    await RideController.getAll(req, res);
});

Router.get('/:uuid', async (req, res) => {
    await RideController.getByUuid(req, res);
});

Router.post('/', async (req, res) => {
    await RideController.insert(req, res);
});

module.exports = Router;