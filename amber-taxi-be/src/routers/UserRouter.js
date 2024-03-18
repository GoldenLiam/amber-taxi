import UserController from '../controllers/UserController';

const express = require('express');
const Router = express.Router();


//Router không lấy dữ liệu req không chỉnh sửa res chỉ thêm middleware để xử lý

Router.get('/', async (req, res) => {
    await UserController.getAll(req, res);
});

Router.get('/:uuid', async (req, res) => {
    await UserController.getByUuid(req, res);
});

Router.get('/getUserByPhone/:phone', async (req, res) => {
    await UserController.getUserByPhone(req, res);
});

Router.post('/', async (req, res) => {
    await UserController.insert(req, res);
});

Router.post('/register', async (req, res) => {
    await UserController.userRegister(req, res);
});

Router.post('/login', async (req, res) => {
    await UserController.userLogin(req, res);
});


module.exports = Router;