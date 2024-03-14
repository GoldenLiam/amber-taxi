const CallingHistoryService = require('./services/CallingHistoryService');

const configureIO = (io) => {
    
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
        // Nếu không định danh thì sẽ nấu ăn
        socket.on('registerBeforeCalling', ({uuid, display_name}) => {

            //Check nếu user đã trong danh sách thì không thêm vào
            if (socketUserList.find(item => { if (item.socket_id === socket.id) {return true;} return false;}) == undefined){

                //Thêm user vào mảng
                socketUserList.push(
                    {
                        socket_id: socket.id,
                        uuid,
                        display_name
                    }
                )
            }
            
        })

        socket.emit("me", socket.id);

        socket.on("disconnect", async () => {

            //Tìm người dùng dựa trên uuid
            var socketUser = socketUserList.find(item => { 
                if (item.socket_id == socket.id) {
                    return true;
                }
                return false;
            })

            if(socketUser){
                // Bỏ lịch sử cuộc gọi của socket này
                callingList = callingList.filter( async (item) => {
                    if(item.person_call == socketUser.uuid){
                        var response = await CallingHistoryService.createCallingHistory({
                            idUserCall: item.person_call,
                            idUserAnswer: item.person_answer,
                            beginCallingTime: item.begin_calling_time,
                            endCallingTime: Date.now(),
                            callingStatus: item.calling_status == "calling" ? "not answer" : item.calling_status
                        });
                        // Có thể phải check response
                        return false;
                    }

                    return true;
                });

            }
            
            // Bỏ người dùng khỏi danh sách socketUserList
			socketUserList = socketUserList.filter(item => item.socket_id !== socket.id);
            
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
                io.to(socket.id).emit("callFail", "This user is not currently online");

                callingList.push({
                    person_call: from,
                    person_answer: userToCall,
                    begin_calling_time: Date.now(),
                    end_calling_time: null,
                    calling_status: "cannot be contacted"
                });
            }
            // Người này online
            else {
                //Tìm xem người này có đang trong phòng gọi với ai khác
                var isUserInCalling = callingList.find(item => {
                    if ( (item.person_call == userToCall || item.person_answer == userToCall) && (item.calling_status == "accepted") ) {
                        return true;
                    }
                    return false;
                })

                // Nghĩa là người này đang bận gọi người khác
                if(isUserInCalling != undefined){
                    // Sự kiện người đó không liên lạc được do đang trong cuộc gọi khác
                    io.to(socket.id).emit("callFail", "This user is busy now");

                    callingList.push({
                        person_call: from,
                        person_answer: userToCall,
                        begin_calling_time: Date.now(),
                        end_calling_time: null,
                        calling_status: "busy"
                    })
                }
                // Người dùng này có thể nhận cuộc gọi
                else {

                    callingList.push({
                        person_call: from,
                        person_answer: userToCall,
                        begin_calling_time: Date.now(),
                        end_calling_time: null,
                        calling_status: "calling"
                    })

                    io.to(socketUser.socket_id).emit("callUser", { signal: signalData, from, name });
                }
            }
        });

        socket.on("answerCall", (data) => {

            //Tìm người dùng dựa trên uuid
            var socketUserCall = socketUserList.find(item => { 
                if (item.uuid == data.to) {
                    return true;
                }
                return false;
            })

            var socketUserAnswer = socketUserList.find(item => { 
                if (item.socket_id == socket.id) {
                    return true;
                }
                return false;
            })

            // console.log("socketUserCall: ")
            // console.log(socketUserCall)

            // console.log("socketUserAnswer: ")
            // console.log(socketUserAnswer)
            
            //Chỉnh lại lịch sử là cuộc gọi này có người nhận
            callingList = callingList.map(item => {
                if( item.person_call == socketUserCall.uuid && item.person_answer == socketUserAnswer.uuid ){
                    if(item.calling_status == "calling"){
                        item.calling_status = "accepted";
                    }
                }
                return item;
            });

            io.to(socketUserCall.socket_id).emit("callAccepted", data.signal)
        });

    });

};

module.exports = {
    configureIO,
}