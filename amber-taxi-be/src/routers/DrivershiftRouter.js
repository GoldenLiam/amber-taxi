import DrivershiftController from "../controllers/DrivershiftController";

const express = require('express');
const Router = express.Router();


//Router không lấy dữ liệu req không chỉnh sửa res chỉ thêm middleware để xử lý

Router.get('/', async (req, res) => {
    await DrivershiftController.getAll(req, res);
});

Router.get('/getAllWithDriverCar', async (req, res) => {
    await DrivershiftController.getAllWithDriverCar(req, res);
});

Router.get('/:uuid', async (req, res) => {
    await DrivershiftController.getByUuid(req, res);
});

Router.get('/getLatestDrivershift/:uuid', async (req, res) => {
    await DrivershiftController.getByLatestDrivershift(req, res);
});

Router.post('/', async (req, res) => {
    await DrivershiftController.insert(req, res);
});

module.exports = Router;