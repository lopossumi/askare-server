const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')
const taskListRouter = require('./controllers/taskList')
const taskRouter = require('./controllers/task')
const registerRouter = require('./controllers/register')
const userRouter = require('./controllers/user')
const favicon = require('serve-favicon')
const path = require('path')

const config = require('./utils/config')

mongoose.connect(config.mongoUrl).then(
    () => {
        console.log('MongoDB connection established')
    },
    err => {
        console.log('No connection to MongoDB.')
        console.log(err)
        process.exit()
    }
)

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.logger)
app.use(middleware.tokenExtractor)

app.get('/', (req, res) => {
    res.send('<h1>askare-server</h1>')
})

app.get('/info', (req, res) => {
    res.send('<h1>askare-server info</h1>')
})

app.use('/api/login', loginRouter)
app.use('/api/register', registerRouter)
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use(middleware.verifyUser)
app.use('/api/users', userRouter)
app.use('/api/tasklists', taskListRouter)
app.use('/api/tasks', taskRouter)

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
