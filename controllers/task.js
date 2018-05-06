const taskRouter = require('express').Router()
const Task = require('../models/Task')

taskRouter.get('/', async (request, response) => {
    const tasks = await Task
        .find({ owner: request.userid })
    response.json(tasks)
})

taskRouter.post('/', async (request, response) => {
    if (request.userid) {
        const task = new Task({
            owner: request.userid,
            title: request.body.title,
            content: request.body.content,
            priority: request.body.priority,
            status: request.body.status,
            color: request.body.color,
        })

        try {
            const savedTask = await task.save()
            return response.status(201).json(savedTask)
        } catch (error) {
            return response.status(500).send(error)
        }
    }
})

module.exports = taskRouter