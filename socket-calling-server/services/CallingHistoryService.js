const connection = require('../db');

const createCallingHistory = (newCallingHistory) => {
    return new Promise(async (resolve, reject) => {
        
        const { 
            idUserCall,
            idUserAnswer,
            beginCallingTime,
            endCallingTime,
            callingStatus
         } = newCallingHistory;
        try {
            const sql = `
            INSERT INTO CallingHistory (idUserCall, idUserAnswer, beginCallingTime, endCallingTime, callingStatus) 
            VALUES (?, ?, CONVERT_TZ(FROM_UNIXTIME(?/1000), 'UTC', '+7:00'), CONVERT_TZ(FROM_UNIXTIME(?/1000), 'UTC', '+7:00'), ?);
            `;
            const values = [
                idUserCall, idUserAnswer, beginCallingTime, endCallingTime, callingStatus
            ];
            connection.query(sql, values, (err, result) => {
                if (err) {
                    console.log(err)
                    resolve({
                        status: 'ERROR',
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

module.exports = {
    createCallingHistory,
}