import BaseService from './BaseService';

class MessageService extends BaseService {
    
    constructor(model) {
        super(model);
    }

    async getAllByRideId(rideId) {
        try {
            let items = await this.model.findMany({
                where: {
                    rideId
                },
                orderBy: {
                    sendingTime: 'asc',
                }
            });
            
            return{
                error: false,
                statusCode: 200,
                data: items
            };

        } catch (error) {

            return {
                error: true,
                statusCode: 500,
                message: error.errmsg || "Not able to get item by rideId",
                errors: error.errors
            };
            
        }
    }

}

export default MessageService;