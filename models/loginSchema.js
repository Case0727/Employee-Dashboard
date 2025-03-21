const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// Schema Definition
const loginUser = new Schema({
    _id: ObjectId,

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    }

});

module.exports = mongoose.model('logins', loginUser) 