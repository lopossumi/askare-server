const mongoose = require('mongoose')

// const list1 = {
//     id: '8273',
//     tasks: [
//         myTask1,
//         myTask2
//     ],
//     title: 'My tasklist number one',
//     owner: 'teppo',
//     color: 'blue'
// }

const taskListSchema = mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
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