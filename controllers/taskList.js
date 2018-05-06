const taskListRouter = require('express').Router()
const TaskList = require('../models/TaskList')

taskListRouter.get('/', async (request, response) => {
    if (!request.userid) {
        return response.status(401).send('Login required.')
    }

    const taskLists = await TaskList
        .find({ owner: request.userid })
        .populate('tasks')
    response.json(taskLists)
})

taskListRouter.post('/', async (request, response) => {
    if (request.userid) {
        const tasklist = new TaskList({
            owner: request.userid,
            title: request.body.title,
            tasks: [],
            color: request.body.color,
        })

        try {
            const savedTask = await tasklist.save()
            return response.status(201).json(savedTask)
        } catch (error) {
            return response.status(500).send(error)
        }
    }
})


module.exports = taskListRouter