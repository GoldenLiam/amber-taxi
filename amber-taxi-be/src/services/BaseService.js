class Service {
    constructor(model) {
        this.model = model;
        this.getAll = this.getAll.bind(this);
        this.insert = this.insert.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll() {
        try {
            let items = await this.model.findMany();
            
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

    async getLimit(query){
        try {

        } catch (error) {
            
        }
    }

    async getByUuid(uuid){
        try {
            
            let item = await this.model.findUnique({
                where: {
                    uuid
                }
            });

            return{
                error: false,
                statusCode: 200,
                data: item
            };

        } catch (error) {

            return {
                error: true,
                statusCode: 500,
                message: error.errmsg || "Not able to get item by uuid",
                errors: error.errors
            };

        }
    }

    async insert(data) {
        try {
            
            let item = await this.model.create({
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
                message: error.errmsg || "Not able to create new item",
                errors: error.errors
            };

        }
    }

    async update(uuid, data) {
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

    async delete(uuid) {
        console.log("delete");
        console.log(uuid);
    }
}

export default Service;