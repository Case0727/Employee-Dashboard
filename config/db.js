const mongoose = require('mongoose')

const db = mongoose.connect('mongodb+srv://root:root@cluster0.9fuup.mongodb.net/backend?retryWrites=true&w=majority&appName=Cluster0')
    .catch(err => {
        console.error('Database connection error:', err);
    })

    .then(() => {
        console.log('Connected to Database')
    })

module.exports = db
