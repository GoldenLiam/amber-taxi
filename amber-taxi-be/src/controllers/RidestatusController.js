import BaseController from  './BaseController';
import RidestatusService from  "../services/RidestatusService";
import ridestatusModel from '../models/Ridestatus';

const ridestatusService = new RidestatusService(ridestatusModel);


class RidestatusController extends BaseController {

  constructor(service) {
    super(service);
  }

  async getByRideId(req, res) {
    const { rideId } = req.params;

    let response = await this.service.getByRideId(rideId);

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

  async getAllByRideId(req, res){
    const { rideId } = req.params;

    let response = await this.service.getAllByRideId(rideId);

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

  async getAllWithRide(req, res){
    let response = await this.service.getAllWithRide();

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

export default new RidestatusController(ridestatusService);