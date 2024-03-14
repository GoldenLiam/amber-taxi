const UserRouter = require('./UserRouter')
const RideRouter = require('./RideRouter')


const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/ride', RideRouter)
}

module.exports = routes