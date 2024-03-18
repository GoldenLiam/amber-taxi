import BaseController from  './BaseController';
import MessageService from  "../services/MessageService";
import messageModel from '../models/Message';

const messageService = new MessageService(messageModel);


class MessageController extends BaseController {

  constructor(service) {
    super(service);
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

}

export default new MessageController(messageService);