const bcrypt = require('bcrypt')
const { generateAccessToken, generateRefreshToken } = require('./JwtService')
const connection = require('../db')

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            //a113114115 
            const sql = `SELECT * FROM User WHERE email = "${email}"`;
            await connection.query(sql, async function (err, result) {
                const comparePassword = bcrypt.compareSync(password, result[0].password)
                if (result.length <= 0 || !comparePassword) {
                    resolve({
                        status: 'ERR',
                        message: 'Thông tin đăng nhập không chính xác'
                    })
                } else {
                    const combinedName = result.map((row) => row.lastName + ' ' + row.firstName);
                    const access_token = await generateAccessToken({
                        uuid: result[0].uuid,
                    })
                    const refresh_token = await generateRefreshToken({
                        uuid: result[0].uuid,
                    })
                    resolve({
                        status: 'OK',
                        message: 'SUCCESS',
                        role: result[0].role,
                        agentName: combinedName,
                        agentUuid: result[0].uuid,
                        access_token,
                        refresh_token,
                    })
                }
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllCustomerInfo = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM Ride`;
            connection.query(sql, (err, result) => {
                if (err) {
                    resolve({
                        status: 'ERR',
                        message: 'An error occured'
                    })
                } else {
                    resolve({
                        status: 'OK',
                        message: 'SUCCESS',
                        data: result
                    })
                }
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    loginUser,
    getAllCustomerInfo
}