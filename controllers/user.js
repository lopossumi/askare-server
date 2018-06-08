const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/User')

userRouter.post('/', async (request, response) => {
    try {
        const body = request.body
        const usernameRegex = /^[a-zA-Z0-9]+$/
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (!body.username.match(usernameRegex)) {
            return response.status(400).send({ error: 'Invalid username. Please use only alphanumeric characters.' })
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
            .find({})
        response.json(users)

    } catch (error) {
        response.status(500).send({ error: error.message })
    }
})

module.exports = userRouter
