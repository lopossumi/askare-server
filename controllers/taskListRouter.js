const taskListRouter = require('express').Router()
const TaskList = require('../models/TaskList')

taskListRouter.get('/', async (request, response) => {
    const taskLists = await TaskList
        .find({})
    response.json(taskLists)
})

module.exports = taskListRouter