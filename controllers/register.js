const bcrypt = require('bcrypt')
const registerRouter = require('express').Router()
const User = require('../models/User')
const TaskList = require('../models/TaskList')
const Task = require('../models/Task')
const validationRegex = require('./rules/validationRegex')

registerRouter.post('/', async (request, response) => {
    try {
        let body = request.body
        //const usernameRegex = /^[a-zA-Z0-9_-]+$/
        //const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        // Store username as written to screenname; forcing username and email to lowercase (so that TestUser1 and testuser1 are the same user)
        const screenname = body.username.toString()
        console.log('wtf')
        console.log(screenname)
        console.log(body.username)
        body.username = body.username.toLowerCase()
        body.email = body.email.toLowerCase()
        console.log(screenname)
        if (!body.username.match(validationRegex.username)) {
            console.log(body.username)
            return response.status(400).send({ error: 'Invalid username. Please use only english alphanumeric characters, hyphen and underscore.' })
        }

        if (!body.email.match(validationRegex.email)) {
            return response.status(400).send({ error: 'Invalid email. Please enter a valid email address.' })
        }

        if (body.password.length < 6) {
            return response.status(400).send({ error: 'Invalid password. Use atleast 6 characters.' })
        }

        if (await User.findOne({ username: body.username })) {
            return response.status(400).send({ error: 'Invalid username. This username is already taken.' })
        }

        if (await User.findOne({ email: body.email })) {
            return response.status(400).send({ error: 'Invalid email. This email address is already taken.' })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            screenname: screenname,
            firstname: body.firstname,
            lastname: body.lastname,
            email: body.email,
            passwordHash,
            showInSearch: body.showInSearch
        })

        const savedUser = await user.save()

        // Generate example tasklist for new user
        const myList = new TaskList({
            owner: savedUser._id,
            title: 'Example list'
        })
        const mySavedList = await myList.save()
        const myTask = new Task({
            owner: savedUser._id,
            tasklist: mySavedList._id,
            title: 'Welcome to askare! Open me for instructions.',
            content: 'Edit me or create a new note to start. You can use *Markdown* syntax to format your tasks:\n* Create lists\n* Make your text **bold** or *italic*\n* or create links. See the [Markdown cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for more formatting options.',
        })
        await myTask.save()

        return response.status(201).json(savedUser)

    } catch (error) {
        response.status(500).send({ error: error.message })
    }
})

module.exports = registerRouter
