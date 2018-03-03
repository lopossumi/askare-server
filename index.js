const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const taskRouter = require('./controllers/taskRouter')
const taskListRouter = require('./controllers/taskListRouter')

const config = require('./utils/config')

mongoose.connect(config.mongoUrl)
// mongoose.Promise = global.Promise what was this?

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.logger)
app.use(middleware.tokenExtractor)

app.get('/', (req, res) => {
    res.send('<h1>askare-server</h1>')
})

app.use('/api/tasks', taskRouter)
app.use('/api/tasklists', taskListRouter)

app.use(middleware.error)

const server = http.createServer(app)

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
    mongoose.connection.close()
})

module.exports = {
    app, server
}
