import BaseController from  './BaseController';
import CarService from  "../services/CarService";
import carModel from '../models/Car';

const carService = new CarService(carModel);


class CarController extends BaseController {

  constructor(service) {
    super(service);
  }

}

export default new CarController(carService);
