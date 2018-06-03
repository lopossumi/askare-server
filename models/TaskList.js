const mongoose = require('mongoose')

const taskListSchema = mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: {
        type: String,
        required: true
    },
    color: {
        type: String
    }
})

const TaskList = mongoose.model('TaskList', taskListSchema)

module.exports = TaskList