const { default: mongoose } = require("mongoose");

const taskSchema = new mongoose.Schema({
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Task', taskSchema)