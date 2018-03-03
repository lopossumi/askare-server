const taskRouter = require('express').Router()
const Task = require('../models/Task')

taskRouter.get('/', async (request, response) => {
    const tasks = await Task
        .find({})
    response.json(tasks)
})

taskRouter.post('/', async (request, response) => {
    const task = new Task({
        owner: request.body.owner, // get this from token
        title: request.body.title,
        content: request.body.content,
        priority: request.body.priority,
        status: request.body.status,
        color: request.body.color,
    })
})

module.exports = taskRouter