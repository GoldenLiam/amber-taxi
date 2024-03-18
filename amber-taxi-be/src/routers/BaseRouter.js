const express = require('express');
const Router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Routers
const UserRouter = require('./UserRouter');
const DriverRouter = require('./DriverRouter');
const RideRouter = require('./RideRouter');
const RidestatusRouter = require('./RidestatusRouter');
const DrivershiftRouter = require('./DrivershiftRouter');
const CarRouter = require('./CarRouter');
const RatingRouter = require('./RatingRouter');
const MessageRouter = require('./MessageRouter');

Router.use('/user', UserRouter);
Router.use('/driver', DriverRouter);
Router.use('/ride', RideRouter);
Router.use('/ridestatus', RidestatusRouter);
Router.use('/drivershift', DrivershiftRouter);
Router.use('/car', CarRouter);
Router.use('/rating', RatingRouter);
Router.use('/message', MessageRouter);
// Các router khác cũng tương tự


module.exports = Router;