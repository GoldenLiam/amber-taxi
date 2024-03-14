import BaseController from  './BaseController';
import RideService from  "../services/RideService";
import rideModel from '../models/Ride';

const rideService = new RideService(rideModel);


class RideController extends BaseController {

  constructor(service) {
    super(service);
  }

}

export default new RideController(rideService);
