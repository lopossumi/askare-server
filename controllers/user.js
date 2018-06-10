const userRouter = require('express').Router()
const User = require('../models/User')
const TaskList = require('../models/TaskList')
const Task = require('../models/Task')
const bcrypt = require('bcrypt')
const validationRegex = require('./rules/validationRegex')
const jwt = require('jsonwebtoken')

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
        if (request.params.id === request.userid) {
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

userRouter.put('/:id', async (request, response) => {
    try {
        if (request.params.id === request.userid) {
            const body = request.body
            // Token belongs to correct user. Get user from database and check current password.
            const user = await User.findById(request.params.id, 'username screenname firstname lastname email passwordHash')
            const passwordCorrect = (user === null || !body.currentpassword) ?
                false :
                await bcrypt.compare(body.currentpassword, user.passwordHash)
            if (!(user && passwordCorrect)) {
                return response.status(401).send({ error: 'Invalid password. You need to provide your current password to make changes.' })
            }

            // Current password was correct, changes are allowed.
            // Validate fields (they should be validated client-side, but assuming users = enemies)
            if (!body.username.match(validationRegex.username)) {
                return response.status(400).send({ error: validationRegex.usernameErrorText })
            }
            if (!body.email.match(validationRegex.email)) {
                return response.status(400).send({ error: validationRegex.emailErrorText })
            }
            // New password is provided, but it is too short.
            if (body.password && body.password.length < 6) {
                return response.status(400).send({ error: 'Invalid new password. Use atleast 6 characters.' })
            }

            // Store username as written to screenname; forcing username and email to lowercase (so that TestUser1 and testuser1 are the same user)
            const screenname = body.username.toString()
            body.username = body.username.toLowerCase()
            body.email = body.email.toLowerCase()

            // Check if trying to change username, but the new one is already taken.
            if (body.username !== user.username && await User.findOne({ username: body.username })) {
                return response.status(400).send({ error: 'Invalid username. This username is already taken.' })
            }

            // Check if trying to change email, but the new one is already taken.
            if (body.email !== user.email && await User.findOne({ email: body.email })) {
                return response.status(400).send({ error: 'Invalid email. This email is already taken.' })
            }

            // Checks passed. Update user with new information.
            let passwordHash = user.passwordHash
            if(body.password){
                const saltRounds = 10
                passwordHash = await bcrypt.hash(body.password, saltRounds)
            }

            let editedUser = new User({
                username: body.username,
                screenname: screenname,
                firstname: body.firstname,
                lastname: body.lastname,
                email: body.email,
                passwordHash,
                showInSearch: body.showInSearch
            })

            editedUser._id = request.params.id
            const savedUser = await User.findByIdAndUpdate(
                request.params.id,
                editedUser,
                { new: true }
            )

            // Sign and return edited user.
            const userForToken = {
                username: savedUser.username,
                id: savedUser._id
            }
            const token = jwt.sign(userForToken, process.env.SECRET)

            response.status(200).send(
                {
                    token,
                    _id: editedUser._id,
                    username: editedUser.username,
                    screenname: editedUser.screenname || editedUser.username,
                    firstname: editedUser.firstname,
                    lastname: editedUser.lastname,
                    email: editedUser.email
                }
            )
        }

    } catch (error) {
        response.status(500).send({ error: error.message })
    }
})


module.exports = userRouter
