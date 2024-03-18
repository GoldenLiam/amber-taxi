import BaseService from './BaseService';

class DrivershiftService extends BaseService {
    
    constructor(model) {
        super(model);
    }

    async getAllWithDriverCar(){
        try {
            let items = await this.model.findMany({
                include: {
                    user: {
                        select: {
                            fullName: true,
                            gender: true,
                            address: true,
                            phone: true,
                            email: true,
                            role: true,
                            dob: true,
                            cic: true,
                            avatar: true,
                            createdAt: true
                        }
                    },
                    car: {
                        select: {
                            modelName: true,
                            seat: true,
                            color: true,
                            licensePlate: true
                        }
                    }
                }
            });
            
            return{
                error: false,
                statusCode: 200,
                data: items
            };

        } catch (error) {
            console.log(error)
            return {
                error: true,
                statusCode: 500,
                message: error.errmsg || "Not able to get all item",
                errors: error.errors
            };
        }
    }
    
    async getLatestDrivershift(driverId) {
        try {
            let item = await this.model.findFirst({
                where: {
                    driverId
                },
                orderBy: {
                    shiftEndTime: 'desc',
                }
            });
            
            return{
                error: false,
                statusCode: 200,
                data: item
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

}

export default DrivershiftService;