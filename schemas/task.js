var mongoose = require('mongoose');

var Task = new mongoose.Schema({
    author: mongoose.Schema.Types.ObjectId,
    authorName: String,
    name: String,
    priority: Number,
    status: String,
    date: Date,
    description: String
});

module.exports = mongoose.model('Task', Task);