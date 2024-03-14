import BaseController from  './BaseController';
import DriverService from '../services/DriverService';
import driverModel from '../models/Driver';

const driverService = new DriverService(driverModel);


class DriverController extends BaseController {

    constructor(service) {
        super(service);
    }


    // Do driver có phương thức đặc biệt này nên phải làm phương thức mới
    async getByUserId(req, res) {
        const { userId } = req.params; // Chỉ có một nên có thể lấy ra thành biến gì cũng được

        let response = await this.service.getByUserId(userId);

        //If get error
        if (response.error){
            return res.status(response.statusCode).json({
                "decription": response.message,
                "data" : "",
                "dataType" : "JSON",
            });
        }

        return res.status(response.statusCode).json({
            "decription": "Success get data",
            "data" : response.data,
            "dataType" : "JSON",
        });
    }

    async updateByUserId(req, res) {
        const { uuid } = req.params;
        let response = await this.service.updateByUserId(uuid, req.body);

        //If get error
        if (response.error){
            return res.status(response.statusCode).json({
                "decription": response.message,
                "data" : "",
                "dataType" : "JSON",
            });
        }

        return res.status(response.statusCode).json({
            "decription": "Success get data",
            "data" : response.data,
            "dataType" : "JSON",
        });
    }
}

export default new DriverController(driverService);