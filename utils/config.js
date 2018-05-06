if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

let port = process.env.PORT
let mongoUrl = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
    port = process.env.TEST_PORT
    mongoUrl = process.env.TEST_MONGODB_URI
}

if (port === undefined){
    console.log('config.js: Port is undefined. Did you forget environment variables?')
    process.exit()
}

if (mongoUrl === undefined){
    console.log('config.js: MongoDB URL is undefined. Did you forget environment variables?')
    process.exit()
}

module.exports = {
    mongoUrl,
    port
}