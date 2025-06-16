const { default: mongoose } = require("mongoose");

const listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    sharedWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

listSchema.methods.hasAccess = function(userId) {
    return this.owner.toString() === userId.toString() || this.sharedWith.includes(userId)
}

module.exports = mongoose.model('List', listSchema)