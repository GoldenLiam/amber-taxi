import BaseController from  './BaseController';
import UserService from  "../services/UserService";
import userModel from '../models/User';

const userService = new UserService(userModel);


class UserController extends BaseController {

  constructor(service) {
    super(service);
  }

  async getUserByPhone(req, res) {
    const { phone } = req.params;

    let response = await this.service.getUserByPhone(phone);

    //If get error
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

  async userLogin(req, res) {
    let response = await this.service.login(req.body);

    if (response.error){
      return res.status(response.statusCode).json({
        "decription": response.message,
        "data" : "",
        "dataType" : "JSON",
      });
    }

    return res.status(response.statusCode).json({
      "decription": "Success login",
      "data" : response.data,
      "dataType" : "JSON",
    });
  }

}

export default new UserController(userService);


//
/*
let userModel;
async function createPrismaModel() {
  userModel = prismadb.user;

  return userModel;
}

async function a (){
  createPrismaModel().then(async () => {
    await prismadb.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prismadb.$disconnect()
    process.exit(1)
  });

  console.log(await userModel.findMany())
}
a();
*/
//

//oke
// async function createUserModel(){
//   console.log(await userModel.findMany())
// }

// gido()


/*
import Controller from  './Controller';
import PostService from  "./../services/PostService";
import Post from  "./../models/Post";

const postService = new PostService(
  new Post().getInstance()
);

class PostController extends Controller {

  constructor(service) {
    super(service);
  }
  
}

export default new PostController(postService);
*/

