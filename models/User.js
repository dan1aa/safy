const {Schema, model} = require('mongoose')

const User = new Schema({
    uniqueValue: {
        type: String,
        required: true
    }
})

module.exports = model('User', User)