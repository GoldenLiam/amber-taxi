const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const short = require('short-uuid');
const CallingHistoryService = require('./services/CallingHistoryService');

/**** APP WEB ****/
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Calling server is running');
});

// host/room để lấy uuid phòng
app.get('/room', (req, res) => {

	res.setHeader('Content-Type', 'application/json');
	
	console.log("api socketUserList");
	console.log(socketUserList);

	console.log("api callingList");
	console.log(callingList);

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

//Middleware đăng nhập hoặc các thứ khác cho socket
/*
io.use((socket, next) => {
	if (isValid(socket.request)) {
		next();
	} else {
		next(new Error("invalid"));
	}
});
*/

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

/*
Một cuộc gọi sẽ cần có thông tin dạng JSON như là
{
	person_call
	person_answer
	begin_calling_time
	end_calling_time
	calling_status
}
Nhiều cuộc gọi sẽ được lưu vào mảng callingList
*/
var callingList = [];

io.on("connection", (socket) => {

	console.log('a user connected: ' + socket.id);

	// Socket bắt sự kiện người dùng bắt đầu online nhận cuộc gọi và yêu cầu định danh với người dùng
	// Nếu không định danh thì sẽ không được vào
	socket.on('registerBeforeCalling', ({uuid, display_name}) => {

		//Check nếu user đã trong danh sách thì không thêm vào
		if (socketUserList.find(item => { if (item.socket_id === socket.id) {return true;} return false;}) === undefined){

			//Thêm user vào mảng
			socketUserList.push({
				socket_id: socket.id,
				uuid,
				display_name
			})
		}
		
	})

	socket.emit("me", socket.id);

	socket.on("disconnect", async () => {

		//Tìm người dùng dựa trên socket id
		var socketUser = socketUserList.find(item => { 
			if (item.socket_id == socket.id) {
				return true;
			}
			return false;
		})

		// Update trạng thái và lấy ra trạng thái
		var callingHistory = null;
		callingList = callingList.map(item => {
			if( item.person_answer == socketUser.uuid || item.person_call == socketUser.uuid ){

				if(item.calling_status == "calling"){
					item.calling_status = "ended";
				}
				item.end_calling_time = Date.now();

				// set new value
				callingHistory = item;
			}
			return item;
		});

		if(callingHistory !== null){
			const response = await CallingHistoryService.createCallingHistory({
				idUserCall: callingHistory.person_call,
				idUserAnswer: callingHistory.person_answer,
				beginCallingTime: callingHistory.begin_calling_time,
				endCallingTime: callingHistory.end_calling_time,
				callingStatus: callingHistory.calling_status
			});

			// Bỏ lịch sử cuộc gọi
			callingList = callingList.filter(item => (item.person_call !==  callingHistory.person_call) || (item.person_answer !==  callingHistory.person_answer));

			// Bỏ người dùng khỏi danh sách socketUserList
			socketUserList = socketUserList.filter(item => item.socket_id !== socket.id);
		}

		// console.log("1 client is out");
		// console.log("socketUserList")
		// console.log(socketUserList)
		
		
		socket.broadcast.emit("callEnded");
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {

		//Tìm người dùng dựa trên uuid
		var socketUser = socketUserList.find(item => { 
			if (item.uuid == userToCall) {
				return true;
			}
			return false;
		})

		// Người này offline
		if( socketUser == undefined){
			// Sự kiện người đó không liên lạc được do offline
			io.to(socketUser.socket_id).emit("callFail", "This user is not currently online");

			callingList.push({
				person_call: from,
				person_answer: userToCall,
				begin_calling_time: Date.now(),
				end_calling_time: null,
				calling_status: "cannot be contacted"
			});
			/*
			callingList.find(item => {
				if(item.person_call == from && item.person_answer == userToCall){
					return true;
				}
				return false;
			})

			// Thêm dữ liệu không liên lạc được do offline
			if (callingList !== undefined){

				// update trạng thái  
				callingList = callingList.map(item => {
					if( item.person_call == from  ){
						item.calling_status = "cannot be contacted";
						console.log(item)
					}
					return item;
				});

				callingList.filter(item => item.socket_id !== socket.id);
			}
			*/
		}
		// Người này online
		else {

			io.to(socketUser.socket_id).emit("callUser", { signal: signalData, from, name });

			// //Tìm xem người này có đang trong phòng gọi với ai khác
			// var isUserInCalling = callingList.find(item => {
			// 	if (item.uuid == userToCall) {
			// 		return true;
			// 	}
			// 	return false;
			// })

			// // Nghĩa là người này đang bận gọi người khác
			// if(isUserInCalling !== undefined){
			// 	// Sự kiện người đó không liên lạc được do offline
			// 	io.to(socketUser.socket_id).emit("callFail", "This user is busy now");

			// 	callingList.push({
			// 		person_call: from,
			// 		person_answer: userToCall,
			// 		begin_calling_time: Date.now(),
			// 		end_calling_time: null,
			// 		calling_status: "busy"
			// 	})
			// }
			// // Người dùng này có thể nhận cuộc gọi
			// else {

			// 	callingList.push({
			// 		person_call: from,
			// 		person_answer: userToCall,
			// 		begin_calling_time: Date.now(),
			// 		end_calling_time: null,
			// 		calling_status: "calling"
			// 	})

			// 	io.to(socketUser.socket_id).emit("callUser", { signal: signalData, from, name });
			// }
		}
	});

	socket.on("answerCall", (data) => {

		//Tìm người dùng dựa trên uuid
		var socketUser = socketUserList.find(item => { 
			if (item.uuid == data.to) {
				return true;
			}
			return false;
		})

		io.to(socketUser.socket_id).emit("callAccepted", data.signal)
	});

});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));