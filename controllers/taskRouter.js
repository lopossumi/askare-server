const taskRouter = require('express').Router()
const Task = require('../models/Task')

taskRouter.get('/', async (request, response) => {
    const tasks = await Task
        .find({})
    response.json(tasks)
})

module.exports = taskRouter