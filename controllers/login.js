const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', async (request, response) => {
    const body = request.body

    try {
        // Check if an email address was given instead of username.
        // (both are unique, and username cannot contain @ symbol)
        let user
        if (request.body.username.indexOf('@') > -1) {
            user = await User
                .findOne({ email: body.username }, 'username firstname lastname email passwordHash')
        } else {
            user = await User
                .findOne({ username: body.username }, 'username firstname lastname email passwordHash')
        }

        const passwordCorrect = (user === null || !body.password) ?
            false :
            await bcrypt.compare(body.password, user.passwordHash)

        if (!(user && passwordCorrect)) {
            return response.status(401).send({ error: 'invalid username or password' })
        }

        const userForToken = {
            username: user.username,
            id: user._id
        }

        const token = jwt.sign(userForToken, process.env.SECRET)

        response.status(200).send({
            token,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
        })

    } catch (exception) {
        console.log('login.js: exception ', exception)
        return response.status(500).send(exception)
    }
})

module.exports = loginRouter
