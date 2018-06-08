const taskRouter = require('express').Router()
const Task = require('../models/Task')

taskRouter.get('/', async (request, response) => {
    try {
        const tasks = await Task.find({ owner: request.userid })
        response.json(tasks)
    } catch (error) {
        return response.status(500).send(error)
    }
})


taskRouter.delete('/:id', async (request, response) => {
    try {
        const task = await Task.findById(request.params.id, 'owner')
        if (task.owner.toString() !== request.userid) {
            return response.status(403).send('Invalid owner.')
        }

        await Task.findByIdAndRemove(task._id)
        return response.status(204).end()

    } catch (error) {
        return response.status(500).send(error)
    }
})

taskRouter.put('/:id', async (request, response) => {
    try {
        const task = await Task.findById(request.params.id, 'owner')
        if (task.owner.toString() !== request.userid) {
            return response.status(403).send('Invalid owner.')
        }

        request.body.modified = Date.now()
        const edited = await Task.findByIdAndUpdate(
            request.params.id,
            request.body,
            { new: true }
        )
        response.status(201).json(edited)
    } catch (error) {
        return response.status(500).send(error)
    }
})

taskRouter.post('/', async (request, response) => {
    const task = new Task({
        owner: request.userid,
        tasklist: request.body.tasklist,
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
})

module.exports = taskRouter