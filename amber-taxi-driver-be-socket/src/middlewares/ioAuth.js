function ioAuth(socket, next) {
    console.log("Đã vô check auth");
    return next();
    
    /* 
    if (socket.handshake.headers.auth) {
        const { auth } = socket.handshake.headers;
        const token = auth.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
            if (err) {
                throw new Error("Authentication error, Invalid Token supplied");
            }
            const theUser = await db.User.findByPk(decodedToken.id);
            if (!theUser)
                throw new Error(
                "Invalid Email or Password, Kindly contact the admin if this is an anomaly"
                );
            socket.theUser = theUser;
            return next();
        });

    } else {
        throw new Error("Authentication error, Please provide a token");
    }
    */
};

export default ioAuth;