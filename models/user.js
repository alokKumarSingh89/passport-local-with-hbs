const mongoose = require('mongoose')
const UseSchema = new mongoose.Schema({
    username: {
        type: 'string',
        required: true,
    },
    password: {
        type: 'string',
        required: true,
    }
});

const User = mongoose.model('User', UseSchema);

module.exports = User;