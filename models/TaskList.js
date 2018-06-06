const mongoose = require('mongoose')

const taskListSchema = mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: {
        type: String,
        required: true
    },
    color: {
        type: String
    },
    modified: { 
        type: Date, 
        default: Date.now 
    },
    removed: { 
        type: Boolean, 
        default: false
    }
})

const TaskList = mongoose.model('TaskList', taskListSchema)

module.exports = TaskList