const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const generateAccessToken = async (payload) => {
    const access_token = jwt.sign({
        ...payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '30s' })
    return access_token
}

const generateRefreshToken = async (payload) => {
    const refresh_token = jwt.sign({
        ...payload
    }, process.env.REFRESH_TOKEN, { expiresIn: '365d' })
    return refresh_token
}

const refreshTokenJwtService = (token) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    resolve({
                        status: 'ERROR',
                        message: 'The authentication'
                    })
                }
                const access_token = await generateAccessToken({
                    uuid: user[0]?.uuid,
                })
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    access_token
                })
            })

        } catch (e) {
            reject(e)
        }
    })
}

const verifyTokenJwtService = (token) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    resolve({
                        status: 'ERROR',
                        message: 'The authentication'
                    })
                }
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                })
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    refreshTokenJwtService,
    verifyTokenJwtService
}