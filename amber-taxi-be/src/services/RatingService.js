import BaseService from './BaseService';

class RatingService extends BaseService {
    
    constructor(model) {
        super(model);
    }

    async getAllByDriverId(driverId){
        try {
            let items = await this.model.findMany({
                where: {
                    driverId
                },
                include:{
                    user_rating_driverIdTouser: {
                        select: {
                            fullName: true,
                        }
                    }
                },
                orderBy: {
                    ratingTime: 'desc',
                }
            });

            return{
                error: false,
                statusCode: 200, //code 200 get success
                data: items
            };

        } catch (error) {
            console.log(error)
            return {
                error: true,
                statusCode: 500,
                message: error.errmsg || "Not able to get item by driverId",
                errors: error.errors
            };

        }
    }


    async getByRideId(rideId){
        try {
            let item = await this.model.findFirst({
                where: {
                    rideId
                }
            });

            return{
                error: false,
                statusCode: 200, //code 200 get success
                data: item
            };

        } catch (error) {
            console.log(error)
            return {
                error: true,
                statusCode: 500,
                message: error.errmsg || "Not able to get item by rideId",
                errors: error.errors
            };

        }
    }

}

export default RatingService;