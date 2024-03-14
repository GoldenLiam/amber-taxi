import BaseController from  './BaseController';
import DrivershiftService from '../services/DrivershiftService';
import drivershiftModel from '../models/Drivershift';

const drivershiftService = new DrivershiftService(drivershiftModel);


class DrivershiftController extends BaseController {

    constructor(service) {
        super(service);
    }

    async getAllWithDriverCar(req, res) {
        let response = await this.service.getAllWithDriverCar();

        //If get error
        //Để data dạng string thì thêm trường dữ liệu res thì ghi vào data luôn ( ví dụ số trang để paging )
        if( response.error ){
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

    async getByLatestDrivershift(req, res){
        const { driverId } = req.params;

        let response = await this.service.getLatestDrivershift(driverId);

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

export default new DrivershiftController(drivershiftService);