const { default: mongoose } = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String,
        trim: true
    }]
})

module.exports = mongoose.model('Task', taskSchema)