var mongoose = require('mongoose');

var FriendRequest = new mongoose.Schema({
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    status: String
});


module.exports = mongoose.model('FriendRequest', FriendRequest);