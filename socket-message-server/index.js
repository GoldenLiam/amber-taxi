require('dotenv').config();
const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const short = require('short-uuid');

import ridestatusModel from "./models/Ridestatus";
import messageModel from "./models/Message";


/**** APP WEB ****/
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Message server is running');
});


// host/room để lấy uuid phòng
app.get('/room', (req, res) => {

	res.setHeader('Content-Type', 'application/json');
	
	console.log("api socketUserList");
	console.log(socketUserList);

	//console.log("api callingList");
	//console.log(callingList);

	try{
		res.json({
			code: "200",
			message: "Success to get new id room",
			room: short.generate(),
		})
	} catch{
		res.json({
			code: "500",
			message: "Fail to get new id room",
			room: "",
		})
	}

});

/**** SOCKET ****/
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});


/*
Một người dùng sẽ cần có các thông tin dạng JSON như là
{
	socket_id
	uuid
	display_name
}
Nhiều user sẽ được lưu vào mảng socketUserList
*/
var socketUserList = [];


io.on("connection", (socket) => {

	console.log('a user connected: ' + socket.id);

    // Socket bắt sự kiện người dùng bắt đầu online nhận cuộc gọi và yêu cầu định danh với người dùng
	// Nếu không định danh thì sẽ không được vào
	socket.on('registerBeforeChating', ({uuid, uuid_ride, role, phone, display_name}) => {

		//Check nếu user chưa có trong danh sách 
		if (socketUserList.find(item => { if (item.socket_id === socket.id) {return true;} return false;}) === undefined){

			//Thêm user vào mảng
			socketUserList.push({
				socket_id: socket.id,
				uuid,
				uuid_ride,
				role,
				phone,
				display_name
			})
		}
	})


    socket.on("disconnect", async () => {

		/*
        //Tìm người dùng dựa trên socket id
		var socketUser = socketUserList.find(item => { 
			if (item.socket_id == socket.id) {
				return true;
			}
			return false;
		})
		*/


        // Bỏ người dùng khỏi danh sách socketUserList
		socketUserList = socketUserList.filter(item => item.socket_id !== socket.id);
    })


	socket.on('sendMessageInRide', async ( {user_to_chat, message, from_user, uuid_ride} ) => {
		// Lấy ra socketuser người nhận tin nhắn trong socket
		let socketUserReceiver = socketUserList.find(item => { 
			if (item.uuid == user_to_chat) {
				return true;
			}
			return false;
		})

		// Lấy ridestatus từ DB
		let ridestatusInDB = await ridestatusModel.findFirst({
			where: {
				rideId: uuid_ride
			},
			orderBy: {
				stateTime: 'desc',
			}
		});

		if( ridestatusInDB.driverId == user_to_chat || ridestatusInDB.driverId == from_user ){
			let insertMessageResult = await messageModel.create({
				data: {
					rideId: uuid_ride,
					senderId: from_user,
					receiverId: user_to_chat,
					message: message
				}
			});

			if (socketUserReceiver != undefined){
				io.to(socketUserReceiver.socket_id).emit("receiveMessageInRide", { message: insertMessageResult, from_user });
			}
		}
	})
	

    // socket.on('sendMessage', ( {userToChat, message, fromUser} ) => {
    //     //Tìm người dùng dựa trên uuid và id cuốc
	// 	var socketUser = socketUserList.find(item => {
	// 		if (item.uuid == userToChat) {
	// 			return true;
	// 		}
	// 		return false;
	// 	})

	// 	if(socketUser == null){

	// 	} 

	// 	io.to(socketUser.socket_id).emit("receiveMessage", { message, fromUser });
    // })


})

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));