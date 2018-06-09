const taskListRouter = require('express').Router()
const TaskList = require('../models/TaskList')
const Task = require('../models/Task')

taskListRouter.get('/', async (request, response) => {
    const taskLists = await TaskList
        .find({ owner: request.userid })
    response.json(taskLists)
})

taskListRouter.delete('/:id', async (request, response) => {
    const tasklist = await TaskList.findById(request.params.id, 'owner')
    if (tasklist.owner.toString() !== request.userid) {
        return response.status(403).send('Invalid owner.')
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


taskListRouter.put('/:id', async (request, response) => {
    try {
        const tasklist = await TaskList.findById(request.params.id, 'owner')
        if (tasklist.owner.toString() !== request.userid) {
            return response.status(403).send('Invalid owner.')
        }

        request.body.modified = Date.now()
        const edited = await TaskList.findByIdAndUpdate(
            request.params.id,
            request.body,
            { new: true }
        )
        response.status(201).json(edited)
    } catch (error) {
        return response.status(500).send(error)
    }
})

taskListRouter.post('/', async (request, response) => {
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
})

module.exports = taskListRouter