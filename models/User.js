const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    firstname:  {
        type: String
    },
    lastname:  {
        type: String
    },
    email: {
        type: String,
        select: false,
        required: true,
    },
    passwordHash: {
        type: String,
        select: false
    },
    tasklists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TaskList' }]
})

const User = mongoose.model('User', userSchema)

module.exports = User