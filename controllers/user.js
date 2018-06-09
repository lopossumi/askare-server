const userRouter = require('express').Router()
const User = require('../models/User')
const TaskList = require('../models/TaskList')
const Task = require('../models/Task')

userRouter.get('/', async (request, response) => {
    try {
        const users = await User
            .find({ showInSearch: true })
        response.json(users)

    } catch (error) {
        response.status(500).send({ error: error.message })
    }
})

userRouter.delete('/:id', async (request, response) => {
    try {
        if(request.params.id === request.userid){
            console.log('deleting...')
            await Task.deleteMany({ owner: request.params.id })
            await TaskList.deleteMany({ owner: request.params.id })
            await User.findByIdAndRemove(request.params.id)
            response.status(204).end()
        }

    } catch (error) {
        response.status(500).send({ error: error.message })
    }
})

module.exports = userRouter
