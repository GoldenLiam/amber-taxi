import BaseService from './BaseService';

class DriverService extends BaseService {
    
    constructor(model) {
        super(model);
    }

    async getAll() {
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
                    }
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
                message: error.errmsg || "Not able to get all item",
                errors: error.errors
            };
        }
    }

    async getByUserId(userId){
        try {
            let item = await this.model.findFirst({
                where: {
                    userId
                },
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
                    }
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
                message: error.errmsg || "Not able to get item by userId",
                errors: error.errors
            };

        }
    }

    async updateByUserId(uuid, data) {
        try {

            let item = await this.model.update({
                where: {
                    uuid
                },
                data
            });

            return{
                error: false,
                statusCode: 201,
                data: item
            };

        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                message: error.errmsg || "Not able to update item",
                errors: error.errors
            };

        }
    }
}


export default DriverService;