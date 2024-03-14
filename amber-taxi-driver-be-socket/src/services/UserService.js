import BaseService from './BaseService';
import { handlingDateTime } from "../utils"; 

class UserService extends BaseService {
    
    constructor(model) {
        super(model);
    }

    //dob need to be formated to ISO time so this method has to be overrided
    async insert(data) {
        try {
            
            data.dob = handlingDateTime.convertDOBStringToISODate(data.dob);
            let item = await this.model.create({
                data
            });

            return{
                error: false,
                statusCode: 201, //code 201 created
                data: item
            };

        } catch (error) {

            return {
                error: true,
                statusCode: 500,
                message: error.errmsg || "Not able to create new item",
                errors: error.errors
            };

        }
    }
    
};

export default UserService;