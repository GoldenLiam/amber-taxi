require('dotenv').config();
const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const short = require('short-uuid');

import { calculateDistance } from "./utils";
import rideModel from "./models/Ride";
import drivershiftModel from "./models/Drivershift";
import ridestatusModel from "./models/Ridestatus";

/**** APP WEB ****/
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Transportation server is running');
});


// host/room để lấy uuid phòng
app.get('/room', (req, res) => {

	res.setHeader('Content-Type', 'application/json');
	
	console.log("api socketUserList");
	console.log(socketUserList);
	console.log(rideList);

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
	uuid_ride
	role
	ride_status
	display_name
	display_car_model
	current_location
}
Nhiều user sẽ được lưu vào mảng socketUserList
*/
var socketUserList = [];


/*
Một cuốc đi sẽ cần có các thông tin dạng JSON như là
{
	uuid
	ride_star_time
	ride_end_time
	address_starting_point
	gps_starting_point
	address_destination_point
	gps_destination_point
	distance
	price

	driverId
	driverShiftId
	state
	stateTime
	stateDetail
);
}
*/

var rideList = [
	// {
	// 	uuid: "ride_1234524",
	// 	ride_star_time: Date.now(),
	// 	ride_end_time: null,
	// 	starting_point: "10.730060049999999;106.69977554999998;632 Lê Văn Lương",
	// 	destination_point: "10.741029216315445;106.70174422162565;Lotte",
	// 	distance: 0,
	// 	price: 10000,
	// 	note: null,
	// 	driver_id: null,
	// 	driver_shift_id: null,
	// 	state: "CREATED",
	// 	state_time: Date.now(),
	// 	state_detail: ""
	// }
];

async function loadRide() {

	let rideInDB = await rideModel.findMany();
	rideInDB.forEach( async (item) => {
		let ridestatusInDB = await ridestatusModel.findFirst({
			where: {
				rideId: item.uuid
			},
			orderBy: {
				stateTime: 'desc',
			}
		});

		if( ridestatusInDB.state == "CREATED" || ridestatusInDB.state == "DENIED" || ridestatusInDB.state == "ACCEPTED" || ridestatusInDB.state == "PICKED" ){
			let ride = {
				uuid: item.uuid,
				full_name: item.fullName,
				gender: item.gender,
				phone: item.phone,
				seat: item.seat,
				ride_start_time: item.rideStartTime,
				ride_end_time: null,
				starting_point: item.startingPoint,
				destination_point: item.destinationPoint,
				distance: item.distance,
				price: item.price,
				note: item.note,

				driver_id: ridestatusInDB.driverId,
				driver_shift_id: ridestatusInDB.driverShiftId,
				state: ridestatusInDB.state,
				state_time: ridestatusInDB.stateTime,
				state_detail: ridestatusInDB.stateDetail
			};

			rideList.push(ride);
		}

	});
}

loadRide();

// Load db bỏ vào ride list


io.on("connection", (socket) => {

	console.log('a user connected: ' + socket.id);


    // Socket bắt sự kiện người dùng bắt đầu online nhận cuốc và yêu cầu định danh với người dùng
	// Nếu không định danh thì sẽ không được vào
	socket.on('registerBeforeHandlingRide', ({uuid, uuid_ride, role, display_name, display_car_model, current_location, phone}) => {

		//Check nếu user chưa có trong danh sách 
		if (socketUserList.find(item => { if (item.socket_id === socket.id) {return true;} return false;}) === undefined){

			//Thêm user vào mảng
			socketUserList.push({
				socket_id: socket.id,
				uuid,
				uuid_ride,
				role,
				display_name,
				display_car_model,
				phone,
				current_location
			});
		}
	})


    socket.on("disconnect", async () => {


        // Bỏ người dùng khỏi danh sách socketUserList
		socketUserList = socketUserList.filter(item => item.socket_id !== socket.id);
    })
	
	
	socket.on('findNearbyDriver', async ( uuid_ride ) => {
		//Tìm cuốc xe dựa trên uuid_ride
		var ride = rideList.find(item => { 
			if (item.uuid == uuid_ride) {
				return true;
			}
			return false;
		})
		
		console.log(ride)

		//
		var socketDriverUserList = socketUserList.filter(item => item.role == "Driver" && item.current_location != null);

		console.log(socketDriverUserList)
		// if (socketDriverUserList == null){
		// 	return false;
		// }

		var destinationLocation = [ parseFloat(ride.starting_point.split(";")[0]), parseFloat(ride.starting_point.split(";")[1]) ];
		var socketDriverDistanceList =  calculateDistance.calculateDistanceDestinationToDriver(socketDriverUserList, destinationLocation);
		

		socketUserList.forEach( item => {
			if(item.role == "CallAgent") io.to(item.socket_id).emit("getNearbyDriver", socketDriverDistanceList);
		});
	})

	
	socket.on('sendRideNearbyDriver', ({ uuid_ride, uuid_driver_list }) => {
		let ride = rideList.find( item => { 
			if (item.uuid == uuid_ride) {
				return true;
			}
			return false;
		});

		// Gửi new ride này cho Driver
		socketUserList.forEach( item => {
			if(item.role == "Driver" && uuid_driver_list.includes(item.uuid)) io.to(item.socket_id).emit("getRideNearbyDriver", ride);
		});
	})


	socket.on('updateLocation', async ({ current_location }) => {

		// Update trạng thái và lấy ra trạng thái
		var socketDriverUser = null;
		socketUserList = socketUserList.map(item => {
			if( item.socket_id == socket.id ){
				// Đặt giá trị mới cho element
				item.current_location = current_location;
				// Lấy ra element này
				socketDriverUser = item;
			}
			return item;
		});

		// Gửi location cho Call Agent
		socketUserList.forEach( item => {
			if(item.role == "CallAgent") io.to(item.socket_id).emit("driverSendLocation", socketDriverUser);
		});

		// Gửi location cho Khách hàng trong cuốc
		
	})

	// Sự kiện dành cho người dùng đặt cuốc
	socket.on('bookRide', async ( uuid_ride ) => {
		
		// Tìm ride trong rideList
		let rideInList = rideList.find(item => { 
			if (item.uuid == uuid_ride) {
				return true;
			}
			return false;
		})

		// Nếu đã tồn tại ride trong list không thêm vào
		if ( rideInList ){
			return;
		}

		// Lấy ride từ DB
		let rideInDB = await rideModel.findUnique({
			where: {
				uuid: uuid_ride
			}
		});

		// Lấy ride status từ DB
		let ridestatusInDB = await ridestatusModel.findFirst({
			where: {
				rideId: uuid_ride
			},
			orderBy: {
				stateTime: 'desc',
			}
		});

		// Nếu trạng thái là DONE cũng không thêm vào
		if ( ridestatusInDB.state == "DONE" || ridestatusInDB.state == "CANCELED" ){
			return;
		}

		let newRide = {
			uuid: uuid_ride,
			full_name: rideInDB.fullName,
			gender: rideInDB.gender,
			phone: rideInDB.phone,
			seat: rideInDB.seat,
			ride_start_time: rideInDB.rideStartTime,
			ride_end_time: null,
			starting_point: rideInDB.startingPoint,
			destination_point: rideInDB.destinationPoint,
			distance: rideInDB.distance,
			price: rideInDB.price,
			note: rideInDB.note,

			driver_id: ridestatusInDB.driverId,
			driver_shift_id: ridestatusInDB.driverShiftId,
			state: ridestatusInDB.state,
			state_time: ridestatusInDB.stateTime,
			state_detail: ridestatusInDB.stateDetail
		}

		rideList.push(newRide);

		// Gửi new ride này cho Driver
		socketUserList.forEach( item => {
			if(item.role == "Driver") io.to(item.socket_id).emit("sendNewRide", newRide);
		});

		// // Nếu trong danh sách chưa có thì thêm vào rideList và gửi thông báo đến các tài xế
		// if( ride == null){

		// 	let newRide = {
		// 		uuid, 
		// 		ride_star_time, 
		// 		ride_end_time, 
		// 		starting_point, 
		// 		destination_point, 
		// 		distance, 
		// 		price, 
		// 		note, 
		// 		driver_id, 
		// 		driver_shift_id, 
		// 		state, 
		// 		state_time, 
		// 		state_detail
		// 	}

		// 	rideList.push(newRide);

		// 	// Gửi new ride này cho Driver
		// 	socketUserList.forEach( item => {
		// 		if(item.role == "Driver") io.to(item.socket_id).emit("sendNewRide", newRide);
		// 	});
		// }

	})

	// Gửi list cho ride driver
	socket.on('getRideList', async () => {
		let newRideList = rideList.filter(item => item.state == "CREATED" || item.state == "DENIED");
		io.to(socket.id).emit("sendRideList", newRideList);
	})

	socket.on('acceptRide', async (uuid_ride) => {
		let ride = rideList.find(item => {
			if ( item.uuid == uuid_ride && (item.state == "CREATED" || item.state == "DENIED") ) {
				return true;
			}
			return false;
		})

		if(!ride){
			io.to(socket.id).emit("acceptFail", "Cuốc xe đã có người nhận hoặc bị hủy");
			return;
		}

		// Lấy ra uuid tài xế
		let driverInList = socketUserList.find(item => { 
			if (item.socket_id == socket.id) {
				return true;
			}
			return false;
		})

		// Kiểm tra ca làm của tài xế này
		let driverShift = await drivershiftModel.findFirst({
			where: {
				driverId: driverInList.uuid
			},
			orderBy: {
				shiftEndTime: 'desc',
			}
		});

		// Có ca làm hợp lệ gán cho tài xế này 
		if( new Date() < new Date(driverShift.shiftEndTime) && new Date() > new Date(driverShift.shiftStartTime) ){

			let newRideState = {
				rideId: uuid_ride,
				driverId: driverInList.uuid,
				driverShiftId: driverShift.uuid,
				state: "ACCEPTED"
			}

			// Thêm trạng thái vào db
			let insertRideStatusResult = await ridestatusModel.create({
				data: newRideState
			});

			/*
			
			driver_id: ridestatusInDB.driverId,
			driver_shift_id: ridestatusInDB.driverShiftId,
			state: ridestatusInDB.state,
			state_time: ridestatusInDB.stateTime,
			state_detail: ridestatusInDB.stateDetail
			*/
			rideList = rideList.map(item => {
				if( item.uuid == uuid_ride ){
					item.driver_id = insertRideStatusResult.driverId;
					item.driver_shift_id = insertRideStatusResult.driverShiftId;
					item.state = insertRideStatusResult.state;
					item.state_time = insertRideStatusResult.stateDetail;
					item.state_detail = insertRideStatusResult.stateDetail;
				}
				return item;
			});

			console.log(rideList);

			// Gửi cho Call Agent
			socketUserList.forEach( item => {
				if(item.role == "CallAgent") io.to(item.socket_id).emit("acceptSuccess", uuid_ride);
			});

			// Gửi cho Customer
			socketUserList.forEach( item => {
				if(item.role == "Customer" && item.phone == ride.phone){
					io.to(item.socket_id).emit("acceptSuccess", uuid_ride);
					return;
				}
			});

			// Gửi cho Driver
			io.to(socket.id).emit("acceptSuccess", uuid_ride);
			

			return;
			
		}
		// Không có ca làm
		else{
			io.to(socket.id).emit("acceptFail", "Bạn không thể nhận cuốc ngoài ca làm");
			return;
		}

	})

	socket.on("pickRide", async (uuid_ride) => {
		let ride = rideList.find(item => {
			if ( item.uuid == uuid_ride && item.state == "ACCEPTED" ) {
				return true;
			}
			return false;
		})


		if(!ride){
			io.to(socket.id).emit("pickFail", "Bạn không thể đón khách hàng này");
			return;
		}


		// Lấy ra uuid tài xế
		let driverInList = socketUserList.find(item => { 
			if (item.socket_id == socket.id) {
				return true;
			}
			return false;
		})

		
		// Kiểm tra ca làm của tài xế này
		let driverShift = await drivershiftModel.findFirst({
			where: {
				driverId: driverInList.uuid
			},
			orderBy: {
				shiftEndTime: 'desc',
			}
		});


		// Tạo trạng thái mới
		let newRideState = {
			rideId: uuid_ride,
			driverId: driverInList.uuid,
			driverShiftId: driverShift.uuid,
			state: "PICKED"
		}

		// Thêm trạng thái vào db
		let insertRideStatusResult = await ridestatusModel.create({
			data: newRideState
		});

		// Update lại rideList
		rideList = rideList.map(item => {
			if( item.uuid == uuid_ride ){
				item.driver_id = insertRideStatusResult.driverId;
				item.driver_shift_id = insertRideStatusResult.driverShiftId;
				item.state = insertRideStatusResult.state;
				item.state_time = insertRideStatusResult.stateDetail;
				item.state_detail = insertRideStatusResult.stateDetail;
			}
			return item;
		});

		// Gửi cho Call Agent
		socketUserList.forEach( item => {
			if(item.role == "CallAgent") io.to(item.socket_id).emit("pickSuccess", uuid_ride);
		});

		// Gửi cho Driver
		io.to(socket.id).emit("pickSuccess", uuid_ride);
		return;
	})


	socket.on('completeRide', async (uuid_ride) => {
		let ride = rideList.find(item => {
			if ( item.uuid == uuid_ride && item.state == "PICKED" ) {
				return true;
			}
			return false;
		})


		if(!ride){
			io.to(socket.id).emit("completeFail", "Bạn chưa thể hoàn thành cuốc xe này");
			return;
		}


		// Lấy ra uuid tài xế
		let driverInList = socketUserList.find(item => { 
			if (item.socket_id == socket.id) {
				return true;
			}
			return false;
		})

		
		// Kiểm tra ca làm của tài xế này
		let driverShift = await drivershiftModel.findFirst({
			where: {
				driverId: driverInList.uuid
			},
			orderBy: {
				shiftEndTime: 'desc',
			}
		});


		// Tạo trạng thái mới
		let newRideState = {
			rideId: uuid_ride,
			driverId: driverInList.uuid,
			driverShiftId: driverShift.uuid,
			state: "DONE"
		}

		// Thêm trạng thái vào db
		let insertRideStatusResult = await ridestatusModel.create({
			data: newRideState
		});

		// Update lại rideList
		rideList = rideList.map(item => {
			if( item.uuid == uuid_ride ){
				item.driver_id = insertRideStatusResult.driverId;
				item.driver_shift_id = insertRideStatusResult.driverShiftId;
				item.state = insertRideStatusResult.state;
				item.state_time = insertRideStatusResult.stateDetail;
				item.state_detail = insertRideStatusResult.stateDetail;
			}
			return item;
		});

		// Gửi cho Call Agent
		socketUserList.forEach( item => {
			if(item.role == "CallAgent") io.to(item.socket_id).emit("completeSuccess", uuid_ride);
		});

		// Gửi cho Driver
		io.to(socket.id).emit("completeSuccess", uuid_ride);
		return;
	})


	socket.on('denyRide', async (uuid_ride) => {
		let ride = rideList.find(item => {
			if ( item.uuid == uuid_ride && item.state == "ACCEPTED" ) {
				return true;
			}
			return false;
		})


		if(!ride){
			io.to(socket.id).emit("acceptFail", "Bạn không thể từ hủy cuốc xe khi ở trạng thái này");
			return;
		}


		// Lấy ra uuid tài xế
		let driverInList = socketUserList.find(item => { 
			if (item.socket_id == socket.id) {
				return true;
			}
			return false;
		})

		
		// Kiểm tra ca làm của tài xế này
		let driverShift = await drivershiftModel.findFirst({
			where: {
				driverId: driverInList.uuid
			},
			orderBy: {
				shiftEndTime: 'desc',
			}
		});


		// Tạo trạng thái mới
		let newRideState = {
			rideId: uuid_ride,
			driverId: driverInList.uuid,
			driverShiftId: driverShift.uuid,
			state: "DENIED"
		}

		// Thêm trạng thái vào db
		let insertRideStatusResult = await ridestatusModel.create({
			data: newRideState
		});

		// Update lại rideList
		rideList = rideList.map(item => {
			if( item.uuid == uuid_ride ){
				item.driver_id = insertRideStatusResult.driverId;
				item.driver_shift_id = insertRideStatusResult.driverShiftId;
				item.state = insertRideStatusResult.state;
				item.state_time = insertRideStatusResult.stateDetail;
				item.state_detail = insertRideStatusResult.stateDetail;
			}
			return item;
		});

		// Gửi cho Call Agent
		socketUserList.forEach( item => {
			if(item.role == "CallAgent") io.to(item.socket_id).emit("denySuccess", uuid_ride);
		});

		// Gửi cho Driver
		io.to(socket.id).emit("denySuccess", uuid_ride);
		return;
	})


	socket.on('cancelRide', async (uuid_ride) => {
		let ride = rideList.find(item => {
			if ( item.uuid == uuid_ride && item.state == "CREATED" ) {
				return true;
			}
			return false;
		})


		if(!ride){
			io.to(socket.id).emit("cancelFail", "Bạn không thể từ hủy cuốc xe");
			return;
		}


		// Lấy ra uuid tài xế
		let driverInList = socketUserList.find(item => { 
			if (item.socket_id == socket.id) {
				return true;
			}
			return false;
		})

		
		// Kiểm tra ca làm của tài xế này
		let driverShift = await drivershiftModel.findFirst({
			where: {
				driverId: driverInList.uuid
			},
			orderBy: {
				shiftEndTime: 'desc',
			}
		});


		// Tạo trạng thái mới
		let newRideState = {
			rideId: uuid_ride,
			driverId: driverInList.uuid,
			driverShiftId: driverShift.uuid,
			state: "CANCELED"
		}

		// Thêm trạng thái vào db
		let insertRideStatusResult = await ridestatusModel.create({
			data: newRideState
		});

		// Update lại rideList
		rideList = rideList.map(item => {
			if( item.uuid == uuid_ride ){
				item.driver_id = insertRideStatusResult.driverId;
				item.driver_shift_id = insertRideStatusResult.driverShiftId;
				item.state = insertRideStatusResult.state;
				item.state_time = insertRideStatusResult.stateDetail;
				item.state_detail = insertRideStatusResult.stateDetail;
			}
			return item;
		});

		// Gửi cho Call Agent
		socketUserList.forEach( item => {
			if(item.role == "CallAgent") io.to(item.socket_id).emit("cancelSuccess", uuid_ride);
		});

		// Gửi cho Driver
		io.to(socket.id).emit("cancelSuccess", uuid_ride);
		return;
	})
	
})

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));