class BaseController {

    constructor(service) {
        this.service = service;
        this.getAll = this.getAll.bind(this);
        this.getByUuid = this.getByUuid.bind(this);
        this.get = this.get.bind(this);
        this.insert = this.insert.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }
  
    async getAll(req, res) {
        let response = await this.service.getAll();

        //If get error
        //Để data dạng string thì thêm trường dữ liệu res thì ghi vào data luôn ( ví dụ số trang để paging )
        if( response.error ){
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

    async getByUuid(req, res) {
        const { uuid } = req.params;

        let response = await this.service.getByUuid(uuid);
        
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
    
    async get(req, res) {
        let response = await this.service.get(req.params)
        return res.status(response.statusCode).send(response);
    }
  
    async insert(req, res) {
        let response = await this.service.insert(req.body);

        if (response.error){
            return res.status(response.statusCode).json({
                "decription": response.message,
                "data" : "",
                "dataType" : "JSON",
            });
        }

        return res.status(response.statusCode).json({
            "decription": "Success insert new data",
            "data" : response.data,
            "dataType" : "JSON",
        });
    }
  
    async update(req, res) {
        const { uuid } = req.params;
        let response = await this.service.update(uuid, req.body);

        if (response.error){
            return res.status(response.statusCode).json({
                "decription": response.message,
                "data" : "",
                "dataType" : "JSON",
            });
        }

        return res.status(response.statusCode).json({
            "decription": "Success update data",
            "data" : response.data,
            "dataType" : "JSON",
        });
    }
  
    async delete(req, res) {
        const { uuid } = req.params;

        let response = await this.service.delete(uuid);

        return res.status(response.statusCode).send(response);
    }
    
}
  
export default BaseController;