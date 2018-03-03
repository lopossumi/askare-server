const express = require('express')
const app = express()
const test_data = require('./test_data')
const cors = require('cors')
const bodyParser = require('body-parser')


const logger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const error = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(bodyParser.json())
app.use(logger)

app.get('/', (req, res) => {
    res.send('<h1>askare-server</h1>')
})

app.get('/tasklists', (req, res) => {
    res.json(test_data)
})

app.use(error)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

