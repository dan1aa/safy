const {Schema, model} = require('mongoose')

const User = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    workName: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: '',
    },
    experience: {
        type: String,
        default: '',
    },
    knowleges: {
        type: Array,
        default: [],
    },
    location: {
        type: String,
        required: true
    }
})

module.exports = model('User', User)