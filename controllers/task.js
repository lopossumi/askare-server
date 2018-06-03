const taskRouter = require('express').Router()
const Task = require('../models/Task')
const TaskList = require('../models/TaskList')

taskRouter.get('/', async (request, response) => {
    if (!request.userid) {
        return response.status(401).send('Login required.')
    }

    try {
        const tasks = await Task.find({ owner: request.userid })
        response.json(tasks)
    } catch (error) {
        return response.status(500).send(error)
    }
})

taskRouter.post('/', async (request, response) => {
    if (!request.userid) {
        return response.status(401).send('Login required.')
    }

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

        const updatedTaskList = await TaskList.findById(savedTask.tasklist)
        updatedTaskList.tasks = [...updatedTaskList.tasks, savedTask._id]

        await TaskList.findByIdAndUpdate(savedTask.tasklist, updatedTaskList)

        return response.status(201).json(savedTask)
    } catch (error) {
        return response.status(500).send(error)
    }
})

module.exports = taskRouter