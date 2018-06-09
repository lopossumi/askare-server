const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/User')

userRouter.post('/', async (request, response) => {
    try {
        let body = request.body
        const usernameRegex = /^[a-zA-Z0-9_-]+$/
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        // Store username as written to screenname; forcing username and email to lowercase (so that TestUser1 and testuser1 are the same user)
        body.screenname = body.username
        body.username = body.username.toLowerCase()
        body.email = body.email.toLowerCase()

        if (!body.username.match(usernameRegex)) {
            console.log(body.username)
            return response.status(400).send({ error: 'Invalid username. Please use only english alphanumeric characters, hyphen and underscore.' })
        }

        if (!body.email.match(emailRegex)) {
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
            screenname: body.screenname,
            firstname: body.firstname,
            lastname: body.lastname,
            email: body.email,
            passwordHash,
            showInSearch: body.showInSearch
        })

        const savedUser = await user.save()
        return response.status(201).json(savedUser)

    } catch (error) {
        response.status(500).send({ error: error.message })
    }
})

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
    if (!request.userid) {
        return response.status(401).send('Login required.')
    }

    try {
        const users = await User
            .find({})
        response.json(users)

    } catch (error) {
        response.status(500).send({ error: error.message })
    }
})

module.exports = userRouter
