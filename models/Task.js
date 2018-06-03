const mongoose = require('mongoose')

// const myTask1 = {
//     id: '9872344324',
//     title: 'Exam',
//     content: '# Remember me!\nExam is on friday 9th @ 14:00.',
//     priority: 3,
//     status: 3,
//     list: '8273',
//     color: 'red'
// }

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
    }
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task