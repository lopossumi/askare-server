const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tasklist: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskList' },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    priority: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 0
    },
    color: {
        type: String
    },
    recycled: {
        type: Boolean,
        default: false
    },
    modified: {
        type: Date,
        default: Date.now
    },

})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task