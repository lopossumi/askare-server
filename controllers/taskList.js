const taskListRouter = require('express').Router()
const TaskList = require('../models/TaskList')
const Task = require('../models/Task')

taskListRouter.get('/', async (request, response) => {
    if (!request.userid) {
        return response.status(401).send('Login required.')
    }

    const taskLists = await TaskList
        .find({ owner: request.userid })
    response.json(taskLists)
})

taskListRouter.delete('/:id', async (request, response) => {
    if (!request.userid) {
        return response.status(401).send('Login required.')
    }
    try {
        await TaskList.findByIdAndRemove(request.params.id)

        // Also remove all tasks associated with the list
        await Task.deleteMany({ tasklist: request.params.id })

        response.status(204).end()
    } catch (error) {
        return response.status(500).send(error)
    }
})


taskListRouter.put('/', async (request, response) => {
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
        const taskList = new TaskList({
            owner: request.userid,
            title: request.body.title,
            color: request.body.color
        })

        try {
            const savedTaskList = await taskList.save()
            return response.status(201).json(savedTaskList)
        } catch (error) {
            return response.status(500).send(error)
        }
    }
})

module.exports = taskListRouter