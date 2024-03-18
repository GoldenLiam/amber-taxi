import BaseController from  './BaseController';
import RatingService from  "../services/RatingService";
import ratingModel from '../models/Rating';

const ratingService = new RatingService(ratingModel);


class RatingController extends BaseController {

  constructor(service) {
    super(service);
  }

  async getDriverRatingByDriverId(req, res){
    const { rideId } = req.params;

    let response = await this.service.getDriverRatingByDriverId(rideId);

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

  async getAllByDriverId(req, res){
    const { driverId } = req.params;

    let response = await this.service.getAllByDriverId(driverId);

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

  async getByRideId(req, res){
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

}

export default new RatingController(ratingService);
