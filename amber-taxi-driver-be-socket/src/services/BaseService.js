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

    async update(id, data) {
        console.log("update");
    }

    async delete(id) {
        console.log("delete");
    }
}

export default Service;