import DriverController from '../controllers/DriverController';

const express = require('express');
const Router = express.Router();


//Router không lấy dữ liệu req không chỉnh sửa res chỉ thêm middleware để xử lý

Router.get('/', async (req, res) => {
    await DriverController.getAll(req, res);
});

Router.get('/:uuid', async (req, res) => {
    await DriverController.getByUuid(req, res);
});

Router.get('/userId/:uuid', async (req, res) => {
    await DriverController.getByUserId(req, res);
});

Router.post('/', async (req, res) => {
    await DriverController.insert(req, res);
});

Router.post('/update/:uuid', async (req, res) => {
    await DriverController.updateByUserId(req, res);
});

module.exports = Router;