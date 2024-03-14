const connection = require('../db')
var amqp = require('amqplib/callback_api');

const createRide = (newRide) => {
    return new Promise(async (resolve, reject) => {
        const { customerName, phoneNumber, startDate, startTime, appointment, addressStartingPoint, addressDestinationPoint, distance, price } = newRide.data
        try {
            const sql = 'INSERT INTO Ride (customerName, phoneNumber, startDate, startTime, appointment, addressStartingPoint, addressDestinationPoint, distance, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [
                customerName,
                phoneNumber,
                startDate,
                startTime,
                appointment,
                addressStartingPoint,
                addressDestinationPoint,
                distance,
                price
            ]
            const messageContent = JSON.stringify({ customerName, phoneNumber, startDate, startTime, appointment, addressStartingPoint, addressDestinationPoint, distance, price });

            // Gửi tin nhắn tới RabbitMQ
            amqp.connect('amqp://localhost:5672', function (error0, connection) {
                if (error0) {
                    throw error0;
                }
                connection.createChannel(function (error1, channel) {
                    if (error1) {
                        throw error1;
                    }

                    var queue = 'hello';
                    var msg = 'Hello World!';

                    channel.assertQueue(queue, {
                        durable: false
                    });
                    channel.sendToQueue(queue, Buffer.from(messageContent));

                    console.log(" [x] Sent %s", messageContent);
                });
                setTimeout(function () {
                    connection.close();
                    process.exit(0);
                }, 500);
            });

            connection.query(sql, values, (err, result) => {
                if (err) {
                    resolve({
                        status: 'ERR',
                        message: 'An error occured'
                    })
                } else {
                    resolve({
                        status: 'OK',
                        message: 'Data inserted successfully',
                    })
                }
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getEarningsOverview = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = 'SELECT MONTH(startDate) AS month, SUM(price) AS total_revenue FROM Ride GROUP BY MONTH(startDate)';
            connection.query(sql, (err, result) => {
                if (err) {
                    resolve({
                        status: 'ERR',
                        message: 'An error occured'
                    })
                }
                result.forEach(row => {
                    const month = row.month;
                    const totalRevenue = row.total_revenue;
                    // console.log(`Month ${month}: Total Revenue ${totalRevenue}`);
                })
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: result
                })
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getCardStatistics = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;

            const sqlQueryMonth = `SELECT SUM(price) AS totalRevenueMonth FROM Ride WHERE YEAR(startDate) = ${currentYear} AND MONTH(startDate) = ${currentMonth}`;
            const sqlQueryYear = `SELECT SUM(price) AS totalRevenueYear FROM Ride WHERE YEAR(startDate) = ${currentYear}`;
            const sqlQueryRide = `SELECT COUNT(uuid) AS totalRide FROM Ride`;

            connection.query(sqlQueryMonth, (error, resultsMonth) => {
                if (error) {
                    console.error('Error executing month query:', error);
                    return;
                }

                const totalRevenueMonth = resultsMonth[0].totalRevenueMonth || 0;

                connection.query(sqlQueryYear, (error, resultsYear) => {
                    if (error) {
                        console.error('Error executing year query:', error);
                        return;
                    }

                    const totalRevenueYear = resultsYear[0].totalRevenueYear || 0;

                    // console.log(`Total revenue of current month: ${totalRevenueMonth}`);
                    // console.log(`Total revenue of current year: ${totalRevenueYear}`);

                    connection.query(sqlQueryRide, (error, resultsRide) => {
                        if (error) {
                            console.error('Error executing ride query:', error);
                            return;
                        }

                        const totalRide = resultsRide[0].totalRide || 0;

                        resolve({
                            status: 'OK',
                            message: 'SUCCESS',
                            resultsMonth: totalRevenueMonth,
                            resultsYear: totalRevenueYear,
                            resultsRide: totalRide,
                        })
                    });
                });
            });
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createRide,
    getEarningsOverview,
    getCardStatistics,
}