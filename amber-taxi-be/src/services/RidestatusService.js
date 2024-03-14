import BaseService from './BaseService';

class RidestatusService extends BaseService {
    
    constructor(model) {
        super(model);
    }

    async getByRideId(rideId){
        try {

            let item = await this.model.findFirst({
                where: {
                    rideId
                },
                orderBy: {
                    stateTime: 'desc',
                }
            });

            // // Trả về kết quả không include nếu driver bị rỗng
            // if ( item.driverId == null && item.state == "CREATED" ) return{
            //     error: false,
            //     statusCode: 200, //code 200 get success
            //     data: item
            // };

            // // Trả về kết quả với include
            // item = await this.model.findFirst({
            //     where: {
            //         rideId
            //     },
            //     include: {
            //         driver: {
            //             select: {
            //                 uuid: true,
            //                 userId: true,
            //                 drivingLicenceNumber: true,
            //                 expiryDate: true,
            //                 state: true
            //             }
            //         },
            //         driverShift: {
            //             select: {
            //                 uuid: true,
            //                 driverId: true,
            //                 carId: true,
            //                 shiftStartTime: true,
            //                 shiftEndTime: true
            //             }
            //         }
            //     }
            // });

            return{
                error: false,
                statusCode: 200, //code 200 get success
                data: item
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

    async getAllByRideId(rideId){
        try {

            let item = await this.model.findMany({
                where: {
                    rideId
                },
                orderBy: {
                    stateTime: 'desc',
                }
            });

            return{
                error: false,
                statusCode: 200, //code 200 get success
                data: item
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

export default RidestatusService;