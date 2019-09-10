let mongoose = require ('mongoose');

let tasksSchema = mongoose.Schema({
    taskId: Number,
    taskName: String,
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'developers'
    }, 
    dueDate: Date,
    taskStatus: { 
        type: String,
        validate: {
            validator: function (taskStatus) {
                return taskStatus === 'inprogress' || taskStatus === 'complete';
            },
            message: 'taskStatus should be either inprogress or complete'
        }
    },
    taskDescription: String
});

let tasksModel = mongoose.model('Tasks', tasksSchema)
module.exports = tasksModel;
