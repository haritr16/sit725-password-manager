const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    username: String,
    platform: String,
    username_platform: String,
    password: String,
    iv: String 
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
