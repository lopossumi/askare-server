const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    screenname:{
        type: String
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
        unique: true
    },
    passwordHash: {
        type: String,
        select: false
    },
    showInSearch: {
        type: Boolean,
        default: false,
        select: false
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User