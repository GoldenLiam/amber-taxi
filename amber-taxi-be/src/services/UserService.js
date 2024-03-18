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
            console.log(error)
            return {
                error: true,
                statusCode: 500,
                message: error.errmsg || "Not able to create new item",
                errors: error.errors
            };

        }
    }

    async register(data) {
        try {
            
            let item = await this.model.create({
                data
            });

            return{
                error: false,
                statusCode: 201, //code 201 created
                data: item
            };

        } catch (error) {
            console.log(error)
            return {
                error: true,
                statusCode: 500,
                message: error.errmsg || "Not able to register new user",
                errors: error.errors
            };
        }
    }

    async getUserByPhone(phone){
        try {
            
            let item = await this.model.findUnique({
                where: {
                    phone
                },
                select: {
                    uuid: true,
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
            });

            //const comparePassword = bcrypt.compareSync(password, data.password)    

            return{
                error: false,
                statusCode: 200, //code 200 read
                data: item
            };

        } catch (error) {

            return {
                error: true,
                statusCode: 500,
                message: error.errmsg || "Not able to get item by phone",
                errors: error.errors
            };

        }
    }

    async login(data){
        try {
            
            let item = await this.model.findUnique({
                where: {
                    phone: data.phone,
                    role: data.role
                },
                select: {
                    uuid: true,
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
            });

            //const comparePassword = bcrypt.compareSync(password, data.password)    

            return{
                error: false,
                statusCode: 200, //code 200 read
                data: item
            };

        } catch (error) {

            return {
                error: true,
                statusCode: 500,
                message: error.errmsg || "Not able to login",
                errors: error.errors
            };

        }
    }
    
};

export default UserService;