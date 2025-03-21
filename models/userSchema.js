const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// Schema Definition
const user = new Schema({
    author: ObjectId,

    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        required: true,
    }
});

// module.exports = mongoose.model('backend', user)

module.exports = mongoose.model('dashboard', user)